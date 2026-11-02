import { ProtectedRoute } from '@/components/auth/protected-route';
import { ProfileForm } from '@/components/auth/profile-form';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="px-4 py-8 sm:py-12">
        <ProfileForm />
      </div>
    </ProtectedRoute>
  );
}
