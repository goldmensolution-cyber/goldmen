import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient } from '#supabase/server'
// Initialize Supabase client
export default defineEventHandler(async (event) => {
  const data = await readBody(event);
const supabase = await serverSupabaseClient(event);

  const { error } = await supabase
    .from('kyanda_callback')
    .insert([{data}]);

  if (error) {
    console.error('Supabase insert error:', error);
  }
  console.log('Callback data saved to Supabase:', data);
  return {
    status: 'success',
  };
});