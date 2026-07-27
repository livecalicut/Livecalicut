import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Contact — LiveCalicut',
  description: 'Get in touch with the LiveCalicut team in Kozhikode.',
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#F8FAFC] font-sans">
      <Container className="space-y-10 py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#2563EB] uppercase">
            Contact
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Talk to LiveCalicut
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#6B7280]">
            Questions about listings, merchant onboarding, jobs, or city partnerships? Reach the
            Kozhikode team directly — we respond on business days.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="mailto:hello@livecalicut.com"
            className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs transition hover:border-[#2563EB]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#2563EB]">
              <Mail className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#111827]">Email</h2>
            <p className="mt-1 text-sm text-[#6B7280]">hello@livecalicut.com</p>
            <p className="mt-3 text-xs font-semibold text-[#2563EB]">Send a message →</p>
          </a>

          <a
            href="tel:+914950000000"
            className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs transition hover:border-[#2563EB]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#2563EB]">
              <Phone className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#111827]">Phone</h2>
            <p className="mt-1 text-sm text-[#6B7280]">+91 495 000 0000</p>
            <p className="mt-3 text-xs font-semibold text-[#2563EB]">Call desk →</p>
          </a>

          <a
            href="https://wa.me/919495000000"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs transition hover:border-[#2563EB]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#111827]">WhatsApp</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Quick citizen & merchant support</p>
            <p className="mt-3 text-xs font-semibold text-[#2563EB]">Chat now →</p>
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#111827]">Office</h2>
            <div className="mt-4 flex gap-3 text-sm leading-relaxed text-[#6B7280]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden />
              <p>
                LiveCalicut City Desk
                <br />
                Kozhikode, Kerala — India
                <br />
                Serving 21 spatial wards across Calicut
              </p>
            </div>
            <p className="mt-6 text-sm text-[#6B7280]">
              Hours: Mon–Sat, 9:30 AM – 6:30 PM IST
            </p>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#111827]">What can we help with?</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#4B5563]">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                Merchant listing & verification
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                Cyberpark jobs & hiring desks
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                News, events & city partnerships
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                Technical support for the platform
              </li>
            </ul>
            <Link
              href="/team"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline"
            >
              Meet our team
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
