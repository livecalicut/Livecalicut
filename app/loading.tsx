import { LogoLoader } from '@/components/shared/logo-loader';

export default function Loading() {
  // Non-fixed loader so it never traps page scroll
  return <LogoLoader label="Loading…" />;
}
