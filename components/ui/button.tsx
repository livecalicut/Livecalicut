import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-[15px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm border border-[#2563EB]',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
        outline: 'border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#F8FAFC] shadow-sm',
        secondary: 'bg-white text-[#111827] hover:bg-[#F8FAFC] border border-[#E5E7EB] shadow-sm',
        ghost: 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]',
        link: 'text-[#2563EB] underline-offset-4 hover:underline p-0 h-auto',
        glass: 'bg-white/90 border border-[#E5E7EB] text-[#111827] hover:text-[#2563EB] shadow-sm',
        floating: 'bg-[#111827] text-white hover:opacity-90 shadow-lg rounded-full',
      },
      size: {
        default: 'h-[44px] px-5 py-2',
        sm: 'h-9 px-3.5 text-xs rounded-xl',
        lg: 'h-12 px-7 text-base rounded-2xl',
        icon: 'h-[44px] w-[44px] p-0 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
