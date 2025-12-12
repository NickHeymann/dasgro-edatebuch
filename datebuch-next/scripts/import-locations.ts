// Import Hamburg Locations into Supabase
// Run with: npx tsx scripts/import-locations.ts

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase credentials
const supabaseUrl = 'https://fsvqwxvccpmkdkfrhozk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdnF3eHZjY3Bta2RrZnJob3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTUzMjgsImV4cCI6MjA4MDM3MTMyOH0.-FgYPxeQjgsmrpV32n_jSSP8bVJENyCF_XBu8MCCj6g';

const supabase = createClient(supabaseUrl, supabaseKey);

// Type mapping
const typeMapping: Record<string, string> = {
  'bar': 'bar',
  'restaurant': 'restaurant',
  'cafe': 'cafe',
  'club': 'club',
  'culture': 'venue',
  'activity': 'activity',
  'wellness': 'activity',
};

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => {
      const map: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

interface RawLocation {
  name: string;
  address: string;
  district: string;
  type: string;
  price_range: string;
  description: string;
  website: string;
  tags: Record<string, string[]>;
  opening_hours: Record<string, string>;
  specialty: string;
}

async function importLocations() {
  console.log('Starting import...\n');

  // Read the JSON file
  const filePath = '/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch/Datenbank Hamburg/Datenbank Hamburg JSON 04_12_2025.txt';
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const locations: RawLocation[] = JSON.parse(rawData);

  console.log(`Found ${locations.length} locations to import\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const loc of locations) {
    try {
      // Map type
      const mappedType = typeMapping[loc.type] || 'venue';

      // Create location
      const { data: location, error: locError } = await supabase
        .from('locations')
        .insert({
          name: loc.name,
          slug: generateSlug(loc.name),
          type: mappedType,
          address: loc.address,
          district: loc.district,
          city: 'Hamburg',
          website: loc.website,
          opening_hours: loc.opening_hours,
          status: 'active',
          created_by: 'import',
        })
        .select()
        .single();

      if (locError) {
        console.error(`Error inserting ${loc.name}:`, locError.message);
        errorCount++;
        continue;
      }

      console.log(`✓ ${loc.name} (${mappedType})`);

      // Insert tags
      const tagInserts: { location_id: string; category: string; tag: string; is_specialty: boolean }[] = [];

      for (const [category, tags] of Object.entries(loc.tags)) {
        if (!tags || !Array.isArray(tags)) continue;

        for (const tag of tags) {
          // Map category names
          let mappedCategory = category;
          if (category === 'culture') mappedCategory = 'activity';

          // Only use valid categories
          const validCategories = ['food', 'drink', 'ingredient', 'activity', 'vibe', 'feature', 'price', 'dietary', 'best_for'];
          if (!validCategories.includes(mappedCategory)) continue;

          tagInserts.push({
            location_id: location.id,
            category: mappedCategory,
            tag: tag,
            is_specialty: false,
          });
        }
      }

      // Add specialty as a tag
      if (loc.specialty) {
        tagInserts.push({
          location_id: location.id,
          category: 'feature',
          tag: loc.specialty,
          is_specialty: true,
        });
      }

      // Add price range as tag
      if (loc.price_range) {
        tagInserts.push({
          location_id: location.id,
          category: 'price',
          tag: loc.price_range,
          is_specialty: false,
        });
      }

      // Insert all tags
      if (tagInserts.length > 0) {
        const { error: tagError } = await supabase
          .from('location_tags')
          .insert(tagInserts);

        if (tagError) {
          console.error(`  Warning: Could not insert tags for ${loc.name}:`, tagError.message);
        } else {
          console.log(`  → ${tagInserts.length} tags added`);
        }
      }

      successCount++;
    } catch (err) {
      console.error(`Error processing ${loc.name}:`, err);
      errorCount++;
    }
  }

  console.log('\n========================================');
  console.log(`Import complete!`);
  console.log(`✓ Success: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
  console.log('========================================\n');
}

// Run import
importLocations().catch(console.error);
