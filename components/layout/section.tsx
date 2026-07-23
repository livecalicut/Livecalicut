import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './container';
import { ScrollReveal } from '@/components/animated/scroll-reveal';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  bgVariant?: 'white' | 'secondary' | 'alt';
  disableAnimation?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  bgVariant = 'white',
  disableAnimation = false,
  ...props
}) => {
  const bgClasses = {
    white: 'bg-white',
    secondary: 'bg-[#F8FAFC]',
    alt: 'bg-[#F1F5F9]',
  };

  return (
    <section id={id} className={cn('w-full py-20 lg:py-24 overflow-hidden', bgClasses[bgVariant], className)} {...props}>
      <Container className="space-y-8">
        {disableAnimation ? (
          children
        ) : (
          <ScrollReveal>{children}</ScrollReveal>
        )}
      </Container>
    </section>
  );
};
