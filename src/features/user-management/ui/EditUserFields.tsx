import { USER_ROLE_OPTIONS } from "../../../entities/user/roles.constants";
import type { AppRole } from "../../../entities/user/user.types";
import {
  formInputStyle,
  formLabelStyle,
} from "../../../shared/styles/styles";
import type {
  EditableUserTextField,
  UserFormErrors,
  UserFormState,
} from "../model/editUser.types";

interface EditUserFieldsProps {
  allowedRoles: readonly AppRole[];
  disabledAccess: boolean;
  disabledProfile: boolean;
  errors: UserFormErrors | null;
  formState: UserFormState;
  onRoleChange: (role: AppRole) => void;
  onTextChange: (key: EditableUserTextField, value: string) => void;
}

const TEXT_FIELDS = [
  { key: "alias", label: "Alias", autoComplete: "nickname", type: "text" },
  {
    key: "full_name",
    label: "Full name",
    autoComplete: "name",
    type: "text",
  },
  { key: "email", label: "Email", autoComplete: "email", type: "email" },
] as const;

function EditUserFields({
  allowedRoles,
  disabledAccess,
  disabledProfile,
  errors,
  formState,
  onRoleChange,
  onTextChange,
}: EditUserFieldsProps) {
  const visibleRoleOptions = USER_ROLE_OPTIONS.filter(({ value }) =>
    allowedRoles.includes(value),
  );

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {TEXT_FIELDS.map(({ key, label, autoComplete, type }) => {
        const errorMessage = errors?.[key];
        const errorId = `${key}-error`;
        const helpId = key === "email" ? "email-help" : undefined;

        return (
          <div key={key} className={key === "email" ? "md:col-span-2" : ""}>
            <label htmlFor={key} className={`flex flex-col gap-1.5 ${formLabelStyle}`}>
              {label}
            </label>
            <input
              id={key}
              name={key}
              type={type}
              autoComplete={autoComplete}
              disabled={disabledProfile}
              value={formState[key]}
              onChange={(event) => onTextChange(key, event.target.value)}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? errorId : helpId}
              className={`${formInputStyle} mt-1.5 w-full disabled:cursor-not-allowed disabled:opacity-60`}
            />
            {errorMessage ? (
              <p
                id={errorId}
                role="alert"
                className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {errorMessage}
              </p>
            ) : key === "email" ? (
              <p id="email-help" className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                This is the email the user signs in with.
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="md:col-span-2 md:max-w-sm">
        <label htmlFor="role" className={`flex flex-col gap-1.5 ${formLabelStyle}`}>
          Role
        </label>
        <select
          id="role"
          name="role"
          disabled={disabledAccess}
          value={formState.role}
          onChange={(event) => onRoleChange(event.target.value as AppRole)}
          className={`${formInputStyle} mt-1.5 w-full disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {disabledAccess && !visibleRoleOptions.some(({ value }) => value === formState.role) && (
            <option value={formState.role}>
              {USER_ROLE_OPTIONS.find(({ value }) => value === formState.role)?.label}
            </option>
          )}
          {visibleRoleOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default EditUserFields;
