import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
  envConfig.NEXT_PUBLIC_SUPABASE_URL,
  envConfig.SUPABASE_SERVICE_ROLE_KEY
);

const initialCMSPayload = {
  hero: {
    title: "Kozhikode's Digital Operating System",
    subtitle: "Discover verified local businesses, Cyberpark IT hiring, local news, beach tourism, and classifieds across Kozhikode.",
    badgeText: "Hyperlocal Platform • 21 Kozhikode Wards Verified",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-ocean-waves-reaching-the-beach-41481-large.mp4"
  },
  metrics: [
    {
      value: "12,400+",
      label: "Verified Outlets",
      subtext: "Shops, dining & healthcare across 21 Calicut spatial wards",
      icon: "Building2",
      color: "text-[#2563EB]",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      value: "5,200+",
      label: "Cyberpark IT Jobs",
      subtext: "Software engineering & corporate hiring positions posted",
      icon: "Briefcase",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      value: "1.2M+",
      label: "Connected Citizens",
      subtext: "Daily Kozhikode residents relying on city OS data",
      icon: "Users",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      value: "24/7 Priority",
      label: "Emergency Response",
      subtext: "Ambulance helplines, blood donors & round-the-clock labs",
      icon: "ShieldAlert",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    }
  ]
};

async function seed() {
  console.log('Seeding CMS data into settings table...');
  const { data, error } = await supabase
    .from('settings')
    .upsert({
      key: 'cms',
      value: initialCMSPayload,
      description: 'Landing Page CMS Content',
      status: 'active',
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error seeding CMS:', error);
  } else {
    console.log('Successfully seeded CMS data:', data.id);
  }
}

seed();
