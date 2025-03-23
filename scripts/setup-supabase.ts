import { createClient } from '@supabase/supabase-js';

// Get environment variables from ENV
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY variables set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('Setting up storage bucket...');
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError.message);
      return;
    }
    
    const eventsBucket = buckets.find(bucket => bucket.name === 'events');
    
    // Create bucket if it doesn't exist
    if (!eventsBucket) {
      console.log('Creating "events" bucket...');
      const { error: createError } = await supabase.storage.createBucket('events', {
        public: true
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError.message);
        return;
      }
      
      console.log('✅ "events" bucket created successfully');
    } else {
      console.log('✅ "events" bucket already exists');
      
      // Make sure it's public
      console.log('Updating bucket to be public...');
      const { error: updateError } = await supabase.storage.updateBucket('events', {
        public: true
      });
      
      if (updateError) {
        console.error('Error updating bucket:', updateError.message);
      } else {
        console.log('✅ Bucket updated to be public');
      }
    }
    
    // Set up storage policies
    console.log('Setting up storage policies...');
    
    try {
      // Try to create policies - may need to run this in the Supabase SQL editor instead
      console.log('Please set up the policies in the Supabase dashboard if this fails.');
      console.log('See the setup instructions for more details.');
      
    } catch (policyError) {
      console.error('Policy setup error:', policyError);
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

async function main() {
  console.log('🔧 Setting up Supabase for RSVPY...');
  
  await setupStorage();
  
  console.log('✨ Setup complete!');
}

main();
