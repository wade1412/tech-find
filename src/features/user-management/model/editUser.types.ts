import type { AppRole, User } from "../../../entities/user/user.types";

export type UserFormState = Pick<
  User,
  "active" | "alias" | "email" | "full_name" | "role"
>;

export type EditableUserTextField = "alias" | "email" | "full_name";

export type UserFormErrors = Partial<
  Record<keyof UserFormState, string | null>
>;

export interface UpdateUserInput extends UserFormState {
  userId: string;
}

export interface UserEditCapabilities {
  allowedRoles: AppRole[];
  canEditAccess: boolean;
  canEditProfile: boolean;
  message: string | null;
}
