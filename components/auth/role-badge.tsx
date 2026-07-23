import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck, User, Store, UserCheck } from 'lucide-react';

interface RoleBadgeProps {
  roleName?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ roleName = 'User' }) => {
  switch (roleName) {
    case 'Super Admin':
      return (
        <Badge variant="destructive" className="gap-1 shadow-rose-500/20">
          <ShieldAlert className="w-3 h-3" />
          Super Admin
        </Badge>
      );
    case 'City Admin':
      return (
        <Badge variant="purple" className="gap-1 shadow-purple-500/20">
          <ShieldCheck className="w-3 h-3" />
          City Admin
        </Badge>
      );
    case 'Moderator':
      return (
        <Badge variant="info" className="gap-1 shadow-cyan-500/20">
          <Shield className="w-3 h-3" />
          Moderator
        </Badge>
      );
    case 'Merchant':
      return (
        <Badge variant="secondary" className="gap-1 shadow-amber-500/20">
          <Store className="w-3 h-3" />
          Merchant
        </Badge>
      );
    case 'User':
      return (
        <Badge variant="success" className="gap-1 shadow-emerald-500/20">
          <UserCheck className="w-3 h-3" />
          Resident User
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1">
          <User className="w-3 h-3" />
          Guest Visitor
        </Badge>
      );
  }
};
