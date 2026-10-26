import React from 'react';
import { ExternalLink, MapPin, Clock, MessageCircle, Navigation } from 'lucide-react';
import { LazyGoogleMap } from '@/components/shared/lazy-google-map';
import { SITE_WHATSAPP_DISPLAY, siteWhatsAppHref } from '@/config/constants';

const KOZHIKODE_MAPS_EMBED =
  'https://maps.google.com/maps?q=Calicut,+Kerala,+India&hl=en&z=13&output=embed';
const KOZHIKODE_MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Calicut,+Kerala,+India';

export const CalicutMapSection: React.FC = () => {
  return (
    <section
      className="w-full border-t border-slate-200 bg-slate-50 py-12 sm:py-16"
      aria-labelledby="kozhikode-map-heading"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8">
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 lg:col-span-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#2563EB] uppercase">
              Location
            </p>
            <h2
              id="kozhikode-map-heading"
              className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
            >
              Calicut city desk
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Listings, jobs, and local services across Calicut. Message the desk on WhatsApp.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <MapPin className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">LiveCalicut</p>
                  <p className="text-sm leading-relaxed text-slate-500">Calicut, Kerala, India</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <Clock className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Office hours</p>
                  <p className="text-sm text-slate-500">Mon–Sat, 9:30 AM – 6:30 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <a
              href={siteWhatsAppHref('Hi LiveCalicut, I would like to get in touch')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp {SITE_WHATSAPP_DISPLAY}
            </a>
            <a
              href={KOZHIKODE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="h-[320px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs sm:h-[400px] lg:col-span-8 lg:h-auto lg:min-h-[360px]">
          <LazyGoogleMap
            src={KOZHIKODE_MAPS_EMBED}
            title="Calicut, Kerala on Google Maps"
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
};
