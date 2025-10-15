import { hasRole, requireRole } from '@/lib/rbac';

describe('RBAC helpers', () => {
  it('checks role membership', () => {
    expect(hasRole('mentor' as any, ['mentor'])).toBe(true);
    expect(hasRole('student' as any, ['mentor'])).toBe(false);
  });

  it('throws when role is not allowed', () => {
    expect(() => requireRole('student' as any, ['mentor'])).toThrow('Forbidden');
  });
});
