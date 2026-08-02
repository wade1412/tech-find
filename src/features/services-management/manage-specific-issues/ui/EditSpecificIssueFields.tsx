import { Autocomplete, TextField } from "@mui/material";
import type { Unit } from "../../../../entities/unit/unit.types";
import { compactSelectStyle } from "../../../../shared/styles/muiSelectStyles";
import {
  formInputStyle,
  formLabelStyle,
  inputErrorStyle,
  inputHintStyle,
} from "../../../../shared/styles/styles";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import type {
  EditableSpecificIssueField,
  SpecificIssueFormErrors,
  SpecificIssueFormState,
} from "../model/manage-specific-issues.types";

interface EditSpecificIssueFieldsProps {
  disabled: boolean;
  errors: SpecificIssueFormErrors | null;
  formState: SpecificIssueFormState;
  onFieldChange: (key: EditableSpecificIssueField, value: string) => void;
  units: readonly Unit[];
}

const TEXT_FIELDS = [
  { key: "name", label: "Issue name" },
  { key: "slug", label: "Slug" },
] as const;

function EditSpecificIssueFields({
  disabled,
  errors,
  formState,
  onFieldChange,
  units,
}: EditSpecificIssueFieldsProps) {
  const unitOptions = [...units].sort(
    (left, right) =>
      Number(right.active) - Number(left.active) ||
      left.display_order - right.display_order ||
      left.name.localeCompare(right.name),
  );
  const selectedUnit =
    unitOptions.find((unit) => unit.id === formState.unit_id) ?? null;

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-5">
      <SectionHeader
        label="Specific Issue Profile"
        subtext="Edit the issue name, stable slug, and related unit"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TEXT_FIELDS.map(({ key, label }) => {
          const error = errors?.[key];
          const errorId = `${key}-error`;
          const helpId = key === "slug" ? "specific-issue-slug-help" : undefined;
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
                <p id="specific-issue-slug-help" className={inputHintStyle}>
                  Used as a stable readable identifier. Use lowercase letters,
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

        <div className="md:col-span-2">
          <label
            id="specific-issue-unit-label"
            htmlFor="unit_id"
            className={formLabelStyle}
          >
            Unit
          </label>
          <Autocomplete
            className="mt-1.5"
            size="small"
            disabled={disabled || unitOptions.length === 0}
            value={selectedUnit}
            options={unitOptions}
            onChange={(_, option) =>
              onFieldChange("unit_id", option?.id ?? "")
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              option.active ? option.name : `${option.name} (Inactive)`
            }
            noOptionsText="No available units"
            sx={(theme) => compactSelectStyle(theme)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(errors?.unit_id)}
                slotProps={{
                  ...params.slotProps,
                  htmlInput: {
                    ...params.slotProps.htmlInput,
                    id: "unit_id",
                    "aria-labelledby": "specific-issue-unit-label",
                    "aria-describedby": errors?.unit_id
                      ? "specific-issue-unit-help unit_id-error"
                      : "specific-issue-unit-help",
                  },
                }}
              />
            )}
          />

          <p id="specific-issue-unit-help" className={inputHintStyle}>
            Determines which unit filter and technician configuration contains
            this issue.
          </p>

          {errors?.unit_id && (
            <p id="unit_id-error" role="alert" className={inputErrorStyle}>
              {errors.unit_id}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}

export default EditSpecificIssueFields;
