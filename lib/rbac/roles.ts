/**
 * Canonical staff / admin role sets used across sidebars, layouts, and APIs.
 * Keep these in sync so menus and data access stay aligned.
 */

export const PLATFORM_ROLES = [
  'Super Admin',
  'City Admin',
  'Moderator',
  'Marketing Executive',
] as const;

export const SUPER_ONLY = ['Super Admin'] as const;
export const CITY_AND_SUPER = ['Super Admin', 'City Admin'] as const;
export const CONTENT_EDITORS = ['Super Admin', 'City Admin', 'Moderator'] as const;
export const LISTING_STAFF = [
  'Super Admin',
  'City Admin',
  'Moderator',
  'Marketing Executive',
] as const;
export const USER_MANAGERS = [
  'Super Admin',
  'City Admin',
  'Marketing Executive',
] as const;

/** Roles that only see records they personally created (created_by = self). */
export const CREATOR_SCOPED_ROLES = ['Marketing Executive'] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export function isSuperAdmin(role: string): boolean {
  return role === 'Super Admin';
}

export function isCityOrSuper(role: string): boolean {
  return role === 'Super Admin' || role === 'City Admin';
}

export function isCreatorScoped(role: string): boolean {
  return (CREATOR_SCOPED_ROLES as readonly string[]).includes(role);
}

/** Roles a given actor is allowed to assign when creating staff. */
export function assignableRolesFor(actorRole: string): string[] {
  if (actorRole === 'Super Admin') {
    return ['City Admin', 'Moderator', 'Marketing Executive'];
  }
  if (actorRole === 'City Admin') {
    return ['Moderator', 'Marketing Executive'];
  }
  if (actorRole === 'Marketing Executive') {
    return ['Moderator'];
  }
  return [];
}
