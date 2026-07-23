import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingComponent: React.FC<RatingProps> = ({ rating, count, size = 'md' }) => {
  const iconSizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base font-bold' };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
      <span className={`font-semibold text-amber-600 dark:text-amber-400 ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-slate-400">({count} reviews)</span>
      )}
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
    <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-600">
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              userName.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{userName}</h5>
            <p className="text-[10px] text-slate-400">{date}</p>
          </div>
        </div>
        <RatingComponent rating={rating} size="sm" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{comment}</p>
    </Card>
  );
};
