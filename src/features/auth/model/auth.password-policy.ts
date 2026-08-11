export const PASSWORD_MIN_LENGTH = 12;

type PasswordRequirementId =
  | "length"
  | "lowercase"
  | "uppercase"
  | "digit"
  | "confirmation";

interface PasswordRequirement {
  id: PasswordRequirementId;
  label: string;
  isMet: boolean;
}

export const PASSWORD_ERROR_TEXTS: Record<PasswordRequirementId, string> = {
  length: `Password must contain at least ${PASSWORD_MIN_LENGTH} characters.`,
  lowercase: `Password must contain at least one lowercase letter`,
  uppercase: `Password must contain at least one uppercase letter`,
  digit: `Password must contait at least one number`,
  confirmation: `Passwords do not match`,
};

export const getPasswordRequirements = (
  password: string,
): PasswordRequirement[] => {
  const isValidLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);

  return [
    {
      id: "length",
      label: "At least 12 characters",
      isMet: isValidLength,
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      isMet: hasLowerCase,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      isMet: hasUpperCase,
    },
    {
      id: "digit",
      label: "One number",
      isMet: hasDigit,
    },
  ];
};

export const validateNewPassword = (
  password: string,
  confirmation: string,
): string | null => {
  const isValidLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (!isValidLength) {
    return PASSWORD_ERROR_TEXTS.length;
  }

  if (!hasLowerCase) {
    return PASSWORD_ERROR_TEXTS.lowercase;
  }

  if (!hasUpperCase) {
    return PASSWORD_ERROR_TEXTS.uppercase;
  }

  if (!hasDigit) {
    return PASSWORD_ERROR_TEXTS.digit;
  }

  if (password !== confirmation) {
    return PASSWORD_ERROR_TEXTS.confirmation;
  }

  return null;
};
