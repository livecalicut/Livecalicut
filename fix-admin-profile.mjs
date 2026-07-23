import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
  envConfig.NEXT_PUBLIC_SUPABASE_URL,
  envConfig.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  console.log('Fetching auth.users...');
  const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersErr) {
    console.error('Error fetching users:', usersErr);
    return;
  }
  const user = usersData.users[0];
  if (!user) {
    console.log('No auth users found.');
    return;
  }

  console.log('Re-creating profile for:', user.email);
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email,
    email: user.email,
    avatar: user.user_metadata?.avatar_url,
    status: 'active',
    is_active: true
  });
  if (profileErr) console.error('Error creating profile:', profileErr);

  console.log('Fetching Super Admin role...');
  const { data: role, error: roleErr } = await supabase.from('roles').select('id').eq('name', 'Super Admin').single();
  if (roleErr) {
    console.error('Error fetching role:', roleErr);
    return;
  }

  console.log('Assigning Super Admin role...');
  const { error: assignErr } = await supabase.from('user_roles').upsert({
    user_id: user.id,
    role_id: role.id
  }, { onConflict: 'user_id,role_id' });
  if (assignErr) console.error('Error assigning role:', assignErr);
  
  console.log('Done! User is now Super Admin.');
}

fix();
