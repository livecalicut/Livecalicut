import { ProtectedRoute } from '@/components/auth/protected-route';
import { ProfileForm } from '@/components/auth/profile-form';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="py-12">
        <ProfileForm />
      </div>
    </ProtectedRoute>
  );
}
