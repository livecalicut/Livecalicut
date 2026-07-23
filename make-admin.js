const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync('/Users/arjun/live calicut MVP/.env.local'));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function makeAdmin() {
  console.log("Connecting to Supabase...");
  
  // 1. Get the newly created user from auth.users via admin API
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError || !usersData.users.length) {
    console.error("No users found or error fetching users:", usersError);
    return;
  }
  
  // Assuming the user is the first one or we take the most recently created
  const user = usersData.users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  console.log(`Found user: ${user.email} (ID: ${user.id})`);

  // 2. Get 'Super Admin' role ID
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'Super Admin')
    .single();

  if (roleError || !role) {
    console.error("Error finding 'Super Admin' role:", roleError);
    return;
  }
  console.log(`Found 'Super Admin' role ID: ${role.id}`);

  // 3. Update the user_roles table
  const { error: updateError } = await supabase
    .from('user_roles')
    .update({ role_id: role.id })
    .eq('user_id', user.id);

  if (updateError) {
    console.error("Error updating user role:", updateError);
    return;
  }

  console.log(`✅ Successfully made ${user.email} a Super Admin!`);
}

makeAdmin();
