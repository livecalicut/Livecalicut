import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const OrganizationSchema = () => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LiveCalicut',
      url: 'https://livecalicut.in',
      logo: 'https://livecalicut.in/logo.png',
      sameAs: [
        'https://facebook.com/livecalicut',
        'https://instagram.com/livecalicut',
        'https://twitter.com/livecalicut',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kozhikode',
        addressRegion: 'Kerala',
        addressCountry: 'IN',
      },
    }}
  />
);
