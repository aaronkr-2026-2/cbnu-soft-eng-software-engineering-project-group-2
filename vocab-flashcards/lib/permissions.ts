export type Role = "admin" | "user";

export type SessionUser = {
  id: string;
  username: string;
  role: Role;
};

const PERMISSIONS = {
  admin: ["word:read", "word:create", "word:edit", "word:delete", "review"],
  user: ["word:read", "review"],
} as const;

export type Permission = (typeof PERMISSIONS)["admin"][number];

export function can(user: SessionUser | null, permission: Permission) {
  if (!user) return false;
  return (PERMISSIONS[user.role] as readonly string[]).includes(permission);
}