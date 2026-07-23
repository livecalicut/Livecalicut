import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldAlert, Home, User } from 'lucide-react';
import { Container } from '@/components/layout/container';

export default function UnauthorizedPage() {
  return (
    <Container className="py-16 sm:py-24 flex items-center justify-center min-h-[65vh]">
      <Card className="max-w-md w-full p-8 text-center space-y-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#111827] font-sans">403 - Access Denied</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed font-normal">
            Your current account role does not have permission to view or manage this restricted dashboard area.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/profile" className="flex-1">
            <Button variant="outline" className="w-full h-[44px] rounded-xl border-[#E5E7EB] hover:bg-slate-50 text-[#111827] font-semibold gap-2">
              <User className="w-4 h-4 text-[#2563EB]" />
              <span>View Profile</span>
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </Container>
  );
}
