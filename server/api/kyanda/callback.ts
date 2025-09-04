import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient } from '#supabase/server'
// Initialize Supabase client
export default defineEventHandler(async (event) => {
  const data = await readBody(event);
const supabase = await serverSupabaseClient(event);

  // Insert the callback data into the 'kyanda_callbacks' table
  const { error } = await supabase
    .from('kyanda_callback')
    .insert([data]);

  if (error) {
    // Optionally log or handle the error
    console.error('Supabase insert error:', error);
  }

  return {
    status: 'success',
  };
});