import { Autocomplete, TextField } from "@mui/material";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import {
  formInputStyle,
  formLabelStyle,
  inputErrorStyle,
  inputHintStyle,
} from "../../../../shared/styles/styles";
import { compactSelectStyle } from "../../../../shared/styles/muiSelectStyles";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import type {
  BrandFormErrors,
  BrandFormState,
} from "../model/manage-brands.types";

type BrandTextFieldKey = "name" | "slug";

interface EditBrandFieldsProps {
  brandGroups: readonly BrandGroup[];
  disabled: boolean;
  errors: BrandFormErrors | null;
  formState: BrandFormState;
  onFieldChange: (key: keyof BrandFormState, value: string) => void;
}

const TEXT_FIELDS: ReadonlyArray<{
  key: BrandTextFieldKey;
  label: string;
}> = [
  { key: "name", label: "Brand name" },
  { key: "slug", label: "Slug" },
];

function EditBrandFields({
  brandGroups,
  disabled,
  errors,
  formState,
  onFieldChange,
}: EditBrandFieldsProps) {
  // Sort brand groups: by active -> by display order -> by name
  const options = [...brandGroups].sort(
    (left, right) =>
      Number(right.active) - Number(left.active) ||
      left.display_order - right.display_order ||
      left.name.localeCompare(right.name),
  );
  const selectedGroup =
    options.find((brandGroup) => brandGroup.id === formState.group_id) ?? null;

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-5">
      <SectionHeader
        label="Brand Profile"
        subtext="Edit the display name, stable slug, and parent brand group"
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {TEXT_FIELDS.map(({ key, label }) => {
          const error = errors?.[key];
          const errorId = `${key}-error`;
          const helpId = key === "slug" ? "brand-slug-help" : undefined;
          const describedBy = [helpId, error ? errorId : undefined]
            .filter(Boolean)
            .join(" ");

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
                  type="text"
                  value={formState[key]}
                  onChange={(event) => onFieldChange(key, event.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy || undefined}
                  className={formInputStyle}
                />
              </label>

              {key === "slug" && (
                <p id="brand-slug-help" className={inputHintStyle}>
                  Used as a stable readable name. Use lowercase letters,
                  numbers, and single hyphens.
                </p>
              )}

              {error && (
                <p id={errorId} role="alert" className={inputErrorStyle}>
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <div className="md:col-span-1">
          <label
            id="brand-group-label"
            htmlFor="group_id"
            className={formLabelStyle}
          >
            Brand group
          </label>
          <Autocomplete
            className="mt-1.5"
            size="small"
            disabled={disabled || options.length === 0}
            value={selectedGroup}
            options={options}
            onChange={(_, option) =>
              onFieldChange("group_id", option?.id ?? "")
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              option.active ? option.name : `${option.name} (Inactive)`
            }
            noOptionsText="No available brand groups"
            sx={(theme) => compactSelectStyle(theme)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(errors?.group_id)}
                slotProps={{
                  ...params.slotProps,
                  htmlInput: {
                    ...params.slotProps.htmlInput,
                    id: "group_id",
                    "aria-labelledby": "brand-group-label",
                    "aria-describedby": errors?.group_id
                      ? "group_id-error"
                      : "brand-group-help",
                  },
                }}
              />
            )}
          />

          <p id="brand-group-help" className={inputHintStyle}>
            Determines where this brand appears in brand filters.
          </p>

          {errors?.group_id && (
            <p id="group_id-error" role="alert" className={inputErrorStyle}>
              {errors.group_id}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}

export default EditBrandFields;
