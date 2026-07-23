import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
      <Skeleton className="w-16 h-16 rounded-2xl" />
      <Skeleton className="w-48 h-4 rounded-lg" />
      <Skeleton className="w-32 h-3 rounded-lg" />
    </div>
  );
}
