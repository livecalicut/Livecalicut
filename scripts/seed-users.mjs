/**
 * Create demo login accounts for each role (RBAC).
 * Run: npm run db:seed:users
 *
 * Password for all: LiveCalicut@2026
 *
 * Hierarchy (created_by):
 *   Super Admin
 *     └─ City Admin, Marketing Executive
 *          └─ Moderator (created by Marketing Executive for demo)
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
    createdByEmail: null,
  },
  {
    role: 'City Admin',
    email: 'cityadmin@livecalicut.test',
    fullName: 'City Admin',
    createdByEmail: 'admin@livecalicut.test',
  },
  {
    role: 'Marketing Executive',
    email: 'marketing@livecalicut.test',
    fullName: 'Marketing Executive',
    createdByEmail: 'admin@livecalicut.test',
  },
  {
    role: 'Moderator',
    email: 'moderator@livecalicut.test',
    fullName: 'Content Moderator',
    createdByEmail: 'marketing@livecalicut.test',
  },
  {
    role: 'Merchant',
    email: 'merchant@livecalicut.test',
    fullName: 'Demo Merchant',
    createdByEmail: 'cityadmin@livecalicut.test',
  },
  {
    role: 'User',
    email: 'user@livecalicut.test',
    fullName: 'Demo Resident',
    createdByEmail: 'marketing@livecalicut.test',
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

  // Ensure Marketing Executive role exists
  await sb.from('roles').upsert(
    {
      name: 'Marketing Executive',
      description: 'Field staff — own listings and created users only',
    },
    { onConflict: 'name' }
  );

  const { data: roles, error: rolesError } = await sb.from('roles').select('id, name');
  if (rolesError) throw new Error(rolesError.message);
  if (!roles?.length) throw new Error('No roles found — run bootstrap/seed first');

  const roleByName = Object.fromEntries(roles.map((r) => [r.name, r.id]));
  const idByEmail = {};

  // Pass 1: create/update auth + profiles
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
    idByEmail[demo.email] = userId;

    const profilePayload = {
      id: userId,
      full_name: demo.fullName,
      email: demo.email,
      status: 'active',
      is_active: true,
      account_status: 'active',
      city: 'Kozhikode',
      deleted_at: null,
    };

    const { error: profileError } = await sb
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });
    if (profileError) {
      console.log(`⚠ profile ${demo.email}: ${profileError.message}`);
    }

    await sb.from('user_roles').delete().eq('user_id', userId);
    const { error: assignError } = await sb.from('user_roles').insert({
      user_id: userId,
      role_id: roleId,
    });
    if (assignError) throw new Error(`${demo.email} role: ${assignError.message}`);

    console.log(`✓ ${demo.role.padEnd(22)} ${demo.email}`);
  }

  // Pass 2: apply created_by hierarchy
  console.log('\nLinking created_by hierarchy…');
  for (const demo of DEMO_USERS) {
    if (!demo.createdByEmail) continue;
    const userId = idByEmail[demo.email];
    const creatorId = idByEmail[demo.createdByEmail];
    if (!userId || !creatorId) continue;

    const { error } = await sb
      .from('profiles')
      .update({ created_by: creatorId })
      .eq('id', userId);

    if (error) {
      console.log(`⚠ created_by ${demo.email}: ${error.message}`);
    } else {
      console.log(`✓ ${demo.email} ← created by ${demo.createdByEmail}`);
    }
  }

  console.log('\n────────────────────────────────────────');
  console.log('Login password (all accounts):');
  console.log(`  ${PASSWORD}`);
  console.log('────────────────────────────────────────');
  console.log('Accounts:');
  for (const r of DEMO_USERS) {
    console.log(`  ${r.role.padEnd(22)}  ${r.email}`);
  }
  console.log('────────────────────────────────────────');
  console.log('Login at: http://localhost:3000/login\n');
}

main().catch((err) => {
  console.error('\nUser seed failed:', err.message, '\n');
  process.exit(1);
});
