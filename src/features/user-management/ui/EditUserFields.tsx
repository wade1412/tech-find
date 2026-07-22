import { Autocomplete, TextField } from "@mui/material";
import { USER_ROLE_OPTIONS } from "../../../entities/user/roles.constants";
import type { AppRole } from "../../../entities/user/user.types";
import { formInputStyle, formLabelStyle } from "../../../shared/styles/styles";
import { compactSelectStyle } from "../../../shared/styles/muiSelectStyles";
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
  const selectedRoleOption =
    USER_ROLE_OPTIONS.find(({ value }) => value === formState.role) ??
    USER_ROLE_OPTIONS[0];
  const roleOptions = visibleRoleOptions.some(
    ({ value }) => value === formState.role,
  )
    ? visibleRoleOptions
    : [selectedRoleOption, ...visibleRoleOptions];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {TEXT_FIELDS.map(({ key, label, autoComplete, type }) => {
        const errorMessage = errors?.[key];
        const errorId = `${key}-error`;

        return (
          <div key={key}>
            <label
              htmlFor={key}
              className={`flex flex-col gap-1.5 ${formLabelStyle}`}
            >
              {label}

              <input
                id={key}
                name={key}
                type={type}
                autoComplete={autoComplete}
                disabled={disabledProfile}
                value={formState[key]}
                onChange={(event) => onTextChange(key, event.target.value)}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? errorId : undefined}
                className={formInputStyle}
              />
            </label>
            {errorMessage ? (
              <p
                id={errorId}
                role="alert"
                className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
        );
      })}

      <div>
        <label
          htmlFor="email"
          className={`flex flex-col gap-1.5 ${formLabelStyle}`}
        >
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={disabledProfile}
            value={formState.email}
            onChange={(event) => onTextChange("email", event.target.value)}
            aria-invalid={Boolean(errors?.email)}
            aria-describedby={errors?.email ? "email-error" : undefined}
            className={formInputStyle}
          />
        </label>
        {errors?.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          id="role-label"
          htmlFor="role"
          className={`flex flex-col gap-1.5 ${formLabelStyle}`}
        >
          Role
          <Autocomplete
            size="small"
            disableClearable
            disabled={disabledAccess}
            value={selectedRoleOption}
            options={roleOptions}
            onChange={(_, option) => onRoleChange(option.value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            getOptionLabel={(option) => option.label}
            sx={(theme) => compactSelectStyle(theme)}
            renderInput={(params) => (
              <TextField
                {...params}
                slotProps={{
                  ...params.slotProps,
                  htmlInput: {
                    ...params.slotProps.htmlInput,
                    id: "role",
                    "aria-labelledby": "role-label",
                  },
                }}
              />
            )}
          />
        </label>
      </div>
    </div>
  );
}

export default EditUserFields;
