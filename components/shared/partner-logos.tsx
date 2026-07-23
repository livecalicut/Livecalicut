import React from 'react';

export interface Partner {
  name: string;
  role: string;
}

interface PartnerLogosProps {
  partners?: Partner[];
}

export const PartnerLogos: React.FC<PartnerLogosProps> = ({ partners = [] }) => {
  if (partners.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="surface-card p-4 text-center flex flex-col justify-center items-center h-28 space-y-1 transition-all duration-200 hover:-translate-y-1"
          >
            <span className="text-[15px] font-bold text-[#111827] font-sans line-clamp-1">
              {partner.name}
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium line-clamp-1">
              {partner.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
