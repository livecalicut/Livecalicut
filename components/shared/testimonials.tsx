import React from 'react';
import { Quote, Star } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animated/scroll-reveal';

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = [] }) => {
  if (testimonials.length === 0) return null;

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((story) => (
        <StaggerItem key={story.name}>
          <div className="surface-card p-6 flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-2 h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Quote className="w-8 h-8 text-[#2563EB]/40" />
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[15px] text-[#111827] leading-relaxed font-normal italic">
                "{story.text}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] space-y-0.5">
              <h5 className="text-[15px] font-bold text-[#111827] font-sans">{story.name}</h5>
              <p className="text-[13px] text-[#6B7280] font-medium">{story.role}</p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};
