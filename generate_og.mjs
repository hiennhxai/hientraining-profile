import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://jkyxajnlhlwfftgplwii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreXhham5saGx3ZmZ0Z3Bsd2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTQ1NjUsImV4cCI6MjEwMDk5MDU2NX0.VQ5c6rUogRDfpjHyLB275NkQy3CYK12gRD2ncLVFcTQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching config from Supabase...');
  const { data, error } = await supabase.from('site_config').select('data').eq('id', 1).single();
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  
  const heroPortraitUrl = data.data.general.heroPortraitUrl;
  console.log('Hero Portrait URL:', heroPortraitUrl);

  if (!heroPortraitUrl) {
    console.error('No heroPortraitUrl found in Supabase.');
    return;
  }

  console.log('Downloading image...');
  const response = await fetch(heroPortraitUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log('Generating OG Image using sharp...');
  
  const width = 1200;
  const height = 630;

  // Create blurred background
  const blurredBg = await sharp(buffer)
    .resize(width, height, { fit: 'cover' })
    .blur(50)
    .modulate({ brightness: 0.5 })
    .toBuffer();

  // Resize portrait to fit in height 630 without cropping
  const portrait = await sharp(buffer)
    .resize({ height: height, fit: 'contain' })
    .toBuffer();

  // Composite them
  await sharp(blurredBg)
    .composite([{ input: portrait, gravity: 'center' }])
    .toFile(path.join(__dirname, 'public', 'og-image.jpg'));

  console.log('Saved to public/og-image.jpg');

  // Update Supabase
  const newData = JSON.parse(JSON.stringify(data.data));
  newData.general.ogImage = 'https://hientraining.com/og-image.jpg';
  
  console.log('Updating Supabase with new ogImage URL...');
  const { error: updateError } = await supabase.from('site_config').update({ data: newData }).eq('id', 1);
  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('Supabase updated successfully!');
  }
}

run();
