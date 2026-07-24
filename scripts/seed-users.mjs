/**
 * Create demo login accounts for each role.
 * Run: npm run db:seed:users
 *
 * Password for all: LiveCalicut@2026
 */
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './load-env.mjs';

loadEnv();

const PASSWORD = 'LiveCalicut@2026';

const DEMO_USERS = [
  {
    role: 'Super Admin',
    email: 'admin@livecalicut.test',
    fullName: 'Super Admin',
  },
  {
    role: 'City Admin',
    email: 'cityadmin@livecalicut.test',
    fullName: 'City Admin',
  },
  {
    role: 'Moderator',
    email: 'moderator@livecalicut.test',
    fullName: 'Content Moderator',
  },
  {
    role: 'Merchant',
    email: 'merchant@livecalicut.test',
    fullName: 'Demo Merchant',
  },
  {
    role: 'User',
    email: 'user@livecalicut.test',
    fullName: 'Demo Resident',
  },
];

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function findUserByEmail(sb, email) {
  // Paginate lightly — demo projects are small
  const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) || null;
}

async function ensureUser(sb, { email, fullName, password }) {
  const existing = await findUserByEmail(sb, email);
  if (existing) {
    await sb.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    return existing.id;
  }

  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error) throw error;
  return data.user.id;
}

async function main() {
  const sb = adminClient();
  console.log('\nLiveCalicut — seeding role login accounts…\n');

  const { data: roles, error: rolesError } = await sb.from('roles').select('id, name');
  if (rolesError) throw new Error(rolesError.message);
  if (!roles?.length) throw new Error('No roles found — run bootstrap/seed first');

  const roleByName = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  const results = [];

  for (const demo of DEMO_USERS) {
    const roleId = roleByName[demo.role];
    if (!roleId) {
      console.log(`✗ skip ${demo.email} — role "${demo.role}" missing`);
      continue;
    }

    const userId = await ensureUser(sb, {
      email: demo.email,
      fullName: demo.fullName,
      password: PASSWORD,
    });

    const { error: profileError } = await sb.from('profiles').upsert(
      {
        id: userId,
        full_name: demo.fullName,
        email: demo.email,
        status: 'active',
        is_active: true,
        account_status: 'active',
        city: 'Kozhikode',
      },
      { onConflict: 'id' }
    );
    if (profileError) {
      console.log(`⚠ profile ${demo.email}: ${profileError.message}`);
    }

    // Replace role assignment cleanly
    await sb.from('user_roles').delete().eq('user_id', userId);
    const { error: assignError } = await sb.from('user_roles').insert({
      user_id: userId,
      role_id: roleId,
    });
    if (assignError) throw new Error(`${demo.email} role: ${assignError.message}`);

    console.log(`✓ ${demo.role.padEnd(12)} ${demo.email}`);
    results.push(demo);
  }

  console.log('\n────────────────────────────────────────');
  console.log('Login password (all accounts):');
  console.log(`  ${PASSWORD}`);
  console.log('────────────────────────────────────────');
  console.log('Accounts:');
  for (const r of results) {
    console.log(`  ${r.role.padEnd(12)}  ${r.email}`);
  }
  console.log('────────────────────────────────────────');
  console.log('Login at: http://localhost:3000/login\n');
}

main().catch((err) => {
  console.error('\nUser seed failed:', err.message, '\n');
  process.exit(1);
});
