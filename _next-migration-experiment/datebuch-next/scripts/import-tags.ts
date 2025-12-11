// Import Tags for existing locations
// Run with: npx tsx scripts/import-tags.ts

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://fsvqwxvccpmkdkfrhozk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdnF3eHZjY3Bta2RrZnJob3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTUzMjgsImV4cCI6MjA4MDM3MTMyOH0.-FgYPxeQjgsmrpV32n_jSSP8bVJENyCF_XBu8MCCj6g';

const supabase = createClient(supabaseUrl, supabaseKey);

// Valid categories (matching the DB constraint)
const validCategories = ['food', 'drink', 'ingredient', 'activity', 'vibe', 'feature', 'price', 'dietary'];

// Map categories from JSON to valid DB categories
function mapCategory(cat: string): string | null {
  const mapping: Record<string, string> = {
    'food': 'food',
    'drink': 'drink',
    'ingredient': 'ingredient',
    'activity': 'activity',
    'vibe': 'vibe',
    'feature': 'feature',
    'price': 'price',
    'dietary': 'dietary',
    'best_for': 'vibe', // Map best_for to vibe
    'culture': 'activity', // Map culture to activity
  };
  return mapping[cat] || null;
}

interface RawLocation {
  name: string;
  tags: Record<string, string[]>;
  specialty: string;
  price_range: string;
}

async function importTags() {
  console.log('Starting tag import...\n');

  // Read locations from JSON
  const filePath = '/Users/nickheymann/Desktop/Mein Business/Programmierprojekte/Solli Datebuch/Datenbank Hamburg/Datenbank Hamburg JSON 04_12_2025.txt';
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const locations: RawLocation[] = JSON.parse(rawData);

  // Get all locations from DB
  const { data: dbLocations } = await supabase
    .from('locations')
    .select('id, name');

  if (!dbLocations) {
    console.error('Could not fetch locations from DB');
    return;
  }

  // Create name -> id map
  const locationMap = new Map<string, string>();
  for (const loc of dbLocations) {
    locationMap.set(loc.name, loc.id);
  }

  let totalTags = 0;
  let successTags = 0;
  let skipTags = 0;

  for (const loc of locations) {
    const locationId = locationMap.get(loc.name);
    if (!locationId) {
      console.log(`Skipping ${loc.name} - not found in DB`);
      continue;
    }

    console.log(`\nProcessing: ${loc.name}`);

    // Process tags
    for (const [rawCategory, tags] of Object.entries(loc.tags)) {
      if (!tags || !Array.isArray(tags)) continue;

      const category = mapCategory(rawCategory);
      if (!category) {
        console.log(`  Skipping category: ${rawCategory}`);
        skipTags += tags.length;
        continue;
      }

      for (const tag of tags) {
        totalTags++;

        const { error } = await supabase
          .from('location_tags')
          .upsert({
            location_id: locationId,
            category: category,
            tag: tag,
            is_specialty: false,
          }, {
            onConflict: 'location_id,category,tag',
          });

        if (error) {
          console.log(`  ✗ ${category}:${tag} - ${error.message}`);
        } else {
          console.log(`  ✓ ${category}:${tag}`);
          successTags++;
        }
      }
    }

    // Add specialty
    if (loc.specialty) {
      totalTags++;
      const { error } = await supabase
        .from('location_tags')
        .upsert({
          location_id: locationId,
          category: 'feature',
          tag: `Specialty: ${loc.specialty.substring(0, 100)}`,
          is_specialty: true,
        }, {
          onConflict: 'location_id,category,tag',
        });

      if (!error) {
        console.log(`  ✓ specialty added`);
        successTags++;
      }
    }

    // Add price range
    if (loc.price_range) {
      totalTags++;
      const { error } = await supabase
        .from('location_tags')
        .upsert({
          location_id: locationId,
          category: 'price',
          tag: loc.price_range,
          is_specialty: false,
        }, {
          onConflict: 'location_id,category,tag',
        });

      if (!error) {
        console.log(`  ✓ price: ${loc.price_range}`);
        successTags++;
      }
    }
  }

  console.log('\n========================================');
  console.log(`Tag import complete!`);
  console.log(`Total tags attempted: ${totalTags}`);
  console.log(`Successfully added: ${successTags}`);
  console.log(`Skipped (invalid category): ${skipTags}`);
  console.log('========================================\n');
}

importTags().catch(console.error);
