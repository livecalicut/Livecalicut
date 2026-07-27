import Link from 'next/link';
import {
  MapPinOff,
  Home,
  Search,
  Building2,
  Briefcase,
  Calendar,
  ShoppingBag,
} from 'lucide-react';

const HOOKS = [
  { href: '/business', label: 'Businesses', description: 'Shops, dining & clinics', icon: Building2 },
  { href: '/jobs', label: 'Jobs', description: 'Cyberpark & local hiring', icon: Briefcase },
  { href: '/marketplace', label: 'Marketplace', description: 'Buy & sell nearby', icon: ShoppingBag },
  { href: '/events', label: 'Events', description: 'What’s on in Kozhikode', icon: Calendar },
] as const;

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-[#E5E7EB] bg-white px-6 py-12 text-center shadow-xs sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#2563EB]">
          <MapPinOff className="h-8 w-8" aria-hidden />
        </div>

        <p className="mt-5 text-xs font-bold tracking-wider text-[#9CA3AF] uppercase">404</p>
        <h1 className="mt-1 font-sans text-3xl font-bold tracking-tight text-[#111827]">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6B7280]">
          This page doesn’t exist, was moved, or the listing isn’t in the database yet.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white hover:bg-[#1D4ED8]"
          >
            <Home className="h-4 w-4" aria-hidden />
            Go home
          </Link>
          <Link
            href="/search"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-bold text-[#111827] hover:border-[#2563EB]"
          >
            <Search className="h-4 w-4 text-[#2563EB]" aria-hidden />
            Search Kozhikode
          </Link>
        </div>

        <div className="mt-10 border-t border-[#F3F4F6] pt-8">
          <p className="mb-3 text-[11px] font-bold tracking-wide text-[#9CA3AF] uppercase">
            Popular places to continue
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {HOOKS.map((hook) => {
              const Icon = hook.icon;
              return (
                <Link
                  key={hook.href}
                  href={hook.href}
                  className="flex items-start gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-3 text-left transition hover:border-[#2563EB] hover:bg-white"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#2563EB]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#111827]">{hook.label}</span>
                    <span className="mt-0.5 block text-[12px] text-[#6B7280]">{hook.description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
