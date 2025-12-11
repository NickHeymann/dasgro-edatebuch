// Import events from events.json into Supabase
// Run with: node scripts/import-events.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://fsvqwxvccpmkdkfrhozk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdnF3eHZjY3Bta2RrZnJob3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTUzMjgsImV4cCI6MjA4MDM3MTMyOH0.-FgYPxeQjgsmrpV32n_jSSP8bVJENyCF_XBu8MCCj6g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importEvents() {
  // Read events.json
  const eventsPath = path.join(__dirname, '../../events.json');
  const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

  console.log(`Found ${eventsData.events.length} events to import`);

  let imported = 0;
  let errors = 0;

  for (const event of eventsData.events) {
    // Transform event to match Supabase schema
    const supabaseEvent = {
      emoji: event.emoji,
      title: event.title,
      date: event.date,
      end_date: event.endDate || null,
      category: event.category,
      description: event.description,
      location: event.location,
      address: event.address,
      coords: event.coords || null,
      link: event.link,
      time: event.time,
      price: event.price,
      vorher_nachher: event.vorher_nachher,
      restaurant: event.restaurant || null,
      bar: event.bar || null,
      treatment: event.treatment || null
    };

    const { data, error } = await supabase
      .from('events')
      .insert(supabaseEvent);

    if (error) {
      console.error(`Error importing "${event.title}":`, error.message);
      errors++;
    } else {
      imported++;
      if (imported % 50 === 0) {
        console.log(`Imported ${imported} events...`);
      }
    }
  }

  console.log(`\nImport complete!`);
  console.log(`Successfully imported: ${imported}`);
  console.log(`Errors: ${errors}`);
}

importEvents().catch(console.error);
