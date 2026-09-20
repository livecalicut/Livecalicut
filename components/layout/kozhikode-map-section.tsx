import React from 'react';
import { ExternalLink, MapPin, Clock, Navigation } from 'lucide-react';
import { LazyGoogleMap } from '@/components/shared/lazy-google-map';

const KOZHIKODE_MAPS_EMBED =
  'https://maps.google.com/maps?q=Kozhikode,+Kerala,+India&hl=en&z=13&output=embed';
const KOZHIKODE_MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Kozhikode,+Kerala,+India';

export const KozhikodeMapSection: React.FC = () => {
  return (
    <section
      className="w-full bg-slate-50 py-12 sm:py-16 border-t border-slate-200"
      aria-labelledby="kozhikode-map-heading"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#2563EB] uppercase">
              Location
            </p>
            <h2
              id="kozhikode-map-heading"
              className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
            >
              Find us in Kozhikode
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              LiveCalicut serves shops, jobs, classifieds and city services across Calicut.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">LiveCalicut City Desk</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Kozhikode, Kerala — India
                    <br />
                    Serving 21 spatial wards
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Office hours</p>
                  <p className="text-sm text-slate-500">Mon–Sat, 9:30 AM – 6:30 PM IST</p>
                </div>
              </div>
            </div>

            <a
              href={KOZHIKODE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-colors shadow-xs"
            >
              <Navigation className="w-4 h-4" aria-hidden />
              Open in Google Maps
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          </div>

          <div className="lg:col-span-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs min-h-[280px] h-[320px] sm:h-[400px] lg:h-auto">
            <LazyGoogleMap
              src={KOZHIKODE_MAPS_EMBED}
              title="Kozhikode, Kerala on Google Maps"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
