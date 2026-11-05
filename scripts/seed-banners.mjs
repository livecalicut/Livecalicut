import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './load-env.mjs';

loadEnv();

const SAMPLE_BANNERS = [
  {
    id: 'banner-1',
    section: 'featured',
    brandName: 'HILITE MALL CALICUT',
    brandTag: 'PREMIER SHOPPING',
    headline: 'Mega Diwali & Festive Fashion Carnival — Min. 50% Off on 120+ Brands',
    dealHighlight: 'Min. 50% Off + ₹500 Instant Cashback',
    subtext: 'Lifestyle, electronics, dining & entertainment hub on Thondayad Bypass, Calicut',
    bottomStrip: '10% Instant Bank Discount on Cards & UPI',
    bankIconText: 'ALL CARDS',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&auto=format&fit=crop&q=80',
    href: '/business/hilite-mall',
    badgeText: 'FESTIVE OFFER',
    badgeColor: 'rose',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'banner-2',
    section: 'featured',
    brandName: 'CALICUT ELECTRONICS & 5G FEST',
    brandTag: 'SMARTPHONE MEGA SALE',
    headline: 'Nova 2 Power 5G & Next-Gen Gadgets from ₹15,999*',
    dealHighlight: 'From ₹15,999* + Fast Delivery',
    subtext: '7000mAh Massive Battery, 48MP Sony Camera & Free Delivery before Diwali across Calicut',
    bottomStrip: '10% Instant Discount on Debit/Credit Cards & EMI',
    bankIconText: 'SBI CARD',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&auto=format&fit=crop&q=80',
    href: '/business',
    badgeText: 'BIG BANG DIWALI',
    badgeColor: 'amber',
    is_active: true,
    display_order: 2,
  },
  {
    id: 'banner-3',
    section: 'featured',
    brandName: 'PARAGON RESTAURANT',
    brandTag: 'CALICUT ICON SINCE 1939',
    headline: 'Classic Malabar Biriyani & Seafood Coastal Feast',
    dealHighlight: 'Flat 20% Off on Family Combos',
    subtext: 'World-famous Dum Biriyani & Fresh Karimeen Pollichathu delivered hot across Kozhikode',
    bottomStrip: '10% Instant Discount on UPI & Card Orders',
    bankIconText: 'SBI / HDFC',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80',
    href: '/business/paragon-restaurant',
    badgeText: 'HOT DEAL',
    badgeColor: 'amber',
    is_active: true,
    display_order: 3,
  },
  {
    id: 'banner-4',
    section: 'featured',
    brandName: 'DECOLINK LUXURY LIVING',
    brandTag: 'PREMIUM INTERIORS',
    headline: 'Modern Modular Kitchen & Luxury Home Decor with 10-Yr Warranty',
    dealHighlight: 'Save up to ₹45,000 on Full Home Interior',
    subtext: 'German fittings, modular wardrobes & free 3D design walkthrough at Nadakkavu',
    bottomStrip: '0% EMI Available with Flexible 24 Months Tenure',
    bankIconText: 'NO-COST EMI',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop&q=80',
    href: '/business/decolink-interiors',
    badgeText: 'EXCLUSIVE DEAL',
    badgeColor: 'emerald',
    is_active: true,
    display_order: 4,
  },
];

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !service) {
    console.log('[seed-banners] No Supabase service credentials found, skipping.');
    return;
  }

  const supabase = createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const value = {
    items: SAMPLE_BANNERS,
    enabled: true,
    show_creative_banner: true,
    banner_headline: 'Spotlight Your Brand Across Kozhikode',
    banner_subtext:
      'Put your business directly in front of 50,000+ verified Kozhikode shoppers, diners & clients daily. Prime full-width banner visibility with direct WhatsApp leads.',
    banner_badge: 'FEATURE YOUR BUSINESS',
    banner_cta_text: 'Promote Your Business',
    banner_cta_url: '/merchant',
  };

  const row = {
    value,
    description: 'Seeded full-width promotional banner carousel items',
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase.from('settings').select('id').eq('key', 'promoted_sliders').maybeSingle();

  if (existing) {
    const { error } = await supabase.from('settings').update(row).eq('id', existing.id);
    if (error) console.error('[seed-banners] Update error:', error);
    else console.log('[seed-banners] Successfully updated promoted_sliders with 4 full banners & enabled=true');
  } else {
    const { error } = await supabase.from('settings').insert({ key: 'promoted_sliders', ...row });
    if (error) console.error('[seed-banners] Insert error:', error);
    else console.log('[seed-banners] Successfully inserted promoted_sliders with 4 full banners');
  }
}

main().catch((err) => {
  console.error('[seed-banners] Error:', err);
});
