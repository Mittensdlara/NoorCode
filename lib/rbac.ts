export type Role = 'student' | 'mentor' | 'admin';

export const roleHierarchy: Record<Role, number> = {
  student: 1,
  mentor: 2,
  admin: 3
};

export function hasRole(userRole: Role | undefined | null, allowed: Role[]): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole);
}

export function requireRole(userRole: Role | undefined | null, allowed: Role[]): void {
  if (!hasRole(userRole, allowed)) {
    const error = new Error('Forbidden');
    (error as any).status = 403;
    throw error;
  }
}

export function canManageCourse(userRole: Role, ownerId: string, userId: string): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'mentor' && ownerId === userId) return true;
  return false;
}
