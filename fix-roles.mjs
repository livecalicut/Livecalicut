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
  console.log('Seeding roles...');
  const roles = [
    { name: 'Guest', description: 'Unauthenticated public visitor' },
    { name: 'User', description: 'Authenticated resident user' },
    { name: 'Merchant', description: 'Kozhikode business owner and service provider' },
    { name: 'Moderator', description: 'Content & review moderation editor' },
    { name: 'City Admin', description: 'Municipal content administrator' },
    { name: 'Super Admin', description: 'Full platform engine superuser' }
  ];
  
  for (const role of roles) {
    await supabase.from('roles').upsert({
        name: role.name,
        description: role.description,
        status: 'active',
        is_active: true
    }, { onConflict: 'name' });
  }

  console.log('Fetching auth.users...');
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const user = usersData?.users?.[0];
  if (!user) return;

  const { data: role } = await supabase.from('roles').select('id').eq('name', 'Super Admin').single();
  if (!role) return;

  console.log('Assigning Super Admin role...');
  const { error: assignErr } = await supabase.from('user_roles').insert({
    user_id: user.id,
    role_id: role.id
  });
  
  if(assignErr) {
      if (assignErr.code !== '23505') console.error(assignErr);
  }
  
  console.log('Done! User is now Super Admin.');
}

fix();
