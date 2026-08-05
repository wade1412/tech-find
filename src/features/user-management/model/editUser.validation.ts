import type { UserFormErrors, UserFormState } from "./editUser.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserForm(form: UserFormState): UserFormErrors {
  const alias = form.alias.trim();
  const fullName = form.full_name.trim();
  const email = form.email.trim();

  return {
    alias: !alias
      ? "Alias cannot be empty"
      : alias.length > 64
        ? "Alias cannot be longer than 64 characters"
        : null,
    full_name: !fullName
      ? "Full name cannot be empty"
      : fullName.length > 120
        ? "Full name cannot be longer than 120 characters"
        : null,
    email: !email
      ? "Email cannot be empty"
      : email.length > 254
        ? "Email cannot be longer than 254 characters"
        : !EMAIL_PATTERN.test(email)
          ? "Enter a valid email address"
          : null,
  };
}
