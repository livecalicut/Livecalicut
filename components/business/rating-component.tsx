import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingComponent: React.FC<RatingProps> = ({ rating, count = 0, size = 'md' }) => {
  const iconSizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base font-bold' };

  // Genuine reviews check: if 0 reviews or rating is 0, don't show empty 0.0 stars
  if (!rating || rating === 0 || count === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Verified Listing</span>
        <span className="text-slate-300 dark:text-slate-600">•</span>
        <span className="text-slate-400">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
      <span className={`font-extrabold text-amber-600 dark:text-amber-400 ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        ({count} {count === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

interface ReviewCardProps {
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  userName,
  userAvatar,
  rating,
  date,
  comment,
}) => {
  return (
    <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center font-bold text-xs text-[#2563EB] overflow-hidden">
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{userName}</p>
            <p className="text-[10px] text-slate-400">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
        {comment}
      </p>
    </Card>
  );
};
