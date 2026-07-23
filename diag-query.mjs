import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_roles(roles(name))')
    .eq('id', '24ab2989-5cbf-4ef0-a34f-0a7220a705e0')
    .single();
  console.log(JSON.stringify(data, null, 2));
}
run();
