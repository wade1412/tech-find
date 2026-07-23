import type { AppRole, User } from "../../../entities/user/user.types";
import { ROLE_LEVEL } from "../../../entities/user/roles.constants";
import { MAIN_ADMIN_ASSIGNABLE_ROLES } from "./editUser.constants";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserEditCapabilities,
  UserFormState,
} from "./editUser.types";

export const EMPTY_USER_FORM_STATE: UserFormState = {
  active: true,
  alias: "",
  email: "",
  full_name: "",
  role: "user",
};

export function createUserFormState(user: User): UserFormState {
  return {
    active: user.active,
    alias: user.alias,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  };
}

export function normalizeUserFormState(draft: UserFormState): UserFormState {
  return {
    ...draft,
    alias: draft.alias.trim(),
    email: draft.email.trim().toLowerCase(),
    full_name: draft.full_name.trim(),
  };
}

export function isUserFormDirty(user: User, draft: UserFormState): boolean {
  const base = normalizeUserFormState(createUserFormState(user));
  const normalizedDraft = normalizeUserFormState(draft);

  return (Object.keys(base) as Array<keyof UserFormState>).some(
    (key) => normalizedDraft[key] !== base[key],
  );
}

export function isNewUserFormDirty(draft: UserFormState): boolean {
  const normalizedDraft = normalizeUserFormState(draft);

  return (Object.keys(EMPTY_USER_FORM_STATE) as Array<keyof UserFormState>).some(
    (key) => normalizedDraft[key] !== EMPTY_USER_FORM_STATE[key],
  );
}

export function buildUpdateUserInput(
  user: User,
  draft: UserFormState,
): UpdateUserInput {
  return {
    userId: user.id,
    expectedUpdatedAt: user.updated_at,
    ...normalizeUserFormState(draft),
  };
}

export function buildCreateUserInput(
  draft: UserFormState,
  redirectTo: string,
): CreateUserInput {
  return {
    ...normalizeUserFormState(draft),
    redirectTo,
  };
}

export function getCreatableUserRoles(
  actorRole: AppRole | null,
): AppRole[] {
  if (actorRole === "owner") {
    return ["user", "secondary_admin", "main_admin", "owner"];
  }

  if (actorRole === "main_admin") {
    return [...MAIN_ADMIN_ASSIGNABLE_ROLES];
  }

  return [];
}

export function getUserEditCapabilities({
  actorId,
  actorRole,
  target,
}: {
  actorId: string | undefined;
  actorRole: AppRole | null;
  target: User;
}): UserEditCapabilities {
  if (!actorId || !actorRole || ROLE_LEVEL[actorRole] < ROLE_LEVEL.main_admin) {
    return {
      allowedRoles: [],
      canEditAccess: false,
      canEditProfile: false,
      message: "You do not have permission to edit users.",
    };
  }

  const isSelf = actorId === target.id;

  if (actorRole === "owner") {
    return {
      allowedRoles: ["user", "secondary_admin", "main_admin", "owner"],
      canEditAccess: !isSelf,
      canEditProfile: true,
      message: isSelf
        ? "You can edit your profile, but you cannot change your own role or status."
        : null,
    };
  }

  const canManageTarget =
    isSelf || ROLE_LEVEL[target.role] < ROLE_LEVEL[actorRole];

  if (!canManageTarget) {
    return {
      allowedRoles: [],
      canEditAccess: false,
      canEditProfile: false,
      message: "Main admins cannot edit another main admin user profile.",
    };
  }

  return {
    allowedRoles: [...MAIN_ADMIN_ASSIGNABLE_ROLES],
    canEditAccess: !isSelf,
    canEditProfile: true,
    message: isSelf
      ? "You can edit your profile, but you cannot change your own role or status."
      : null,
  };
}
