import Checkbox from "../../../../shared/ui/Checkbox";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import {
  formInputStyle,
  formLabelStyle,
  inputErrorStyle,
  inputHintStyle,
} from "../../../../shared/styles/styles";
import {
  UNIT_PROFILE_FIELDS,
  UNIT_PROPERTY_FIELDS,
} from "../model/manage-units.constants";
import type {
  UnitFormErrors,
  UnitFormState,
  UnitProfileFieldKey,
  UnitPropertyFieldKey,
} from "../model/manage-units.types";

interface EditUnitFieldsProps {
  disabled: boolean;
  errors: UnitFormErrors | null;
  formState: UnitFormState;
  onProfileChange: (key: UnitProfileFieldKey, value: string) => void;
  onPropertyToggle: (key: UnitPropertyFieldKey) => void;
}

function EditUnitFields({
  disabled,
  errors,
  formState,
  onProfileChange,
  onPropertyToggle,
}: EditUnitFieldsProps) {
  return (
    <fieldset
      disabled={disabled}
      className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,0.9fr)] md:gap-6"
    >
      <section className="flex min-w-0 flex-col gap-3">
        <SectionHeader
          label="Unit Profile"
          subtext="Edit the label, stable slug, and list position"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {UNIT_PROFILE_FIELDS.map(({ key, label }) => {
            const error = errors?.[key];
            const errorId = `${key}-error`;
            const helpId =
              key === "display_order" ? "display-order-help" : undefined;
            const describedBy = [helpId, error ? errorId : undefined]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={key} className={key === "name" ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={key}
                  className={`flex flex-col gap-1.5 ${formLabelStyle}`}
                >
                  {label}
                  <input
                    id={key}
                    name={key}
                    type={key === "display_order" ? "number" : "text"}
                    inputMode={key === "display_order" ? "numeric" : undefined}
                    min={key === "display_order" ? 0 : undefined}
                    max={key === "display_order" ? 9999 : undefined}
                    value={formState[key]}
                    onChange={(event) =>
                      onProfileChange(key, event.target.value)
                    }
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy || undefined}
                    className={formInputStyle}
                  />
                </label>

                {key === "slug" && (
                  <p id="slug-order-help" className={inputHintStyle}>
                    Used as a stable readable name. Use lowercase letters,
                    numbers, and single hyphens.
                  </p>
                )}

                {key === "display_order" && (
                  <p id="display-order-help" className={inputHintStyle}>
                    Controls the position on the filter panel. Leave gaps such
                    as 10, 20, 30 so a new unit can be inserted later as 15
                    without renumbering the full list.
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
        </div>
      </section>

      <div
        aria-hidden="true"
        className="h-px w-full bg-zinc-200 md:h-auto md:w-px md:self-stretch dark:bg-zinc-800"
      />

      <section className="flex min-w-0 flex-col gap-3">
        <SectionHeader
          label="Unit Properties"
          subtext="Control which properties may be related to this unit"
        />

        <div className="grid grid-cols-1 gap-2.5">
          {UNIT_PROPERTY_FIELDS.map(({ key, label }) => (
            <Checkbox
              key={key}
              id={key}
              label={label}
              checked={formState[key]}
              onChange={() => onPropertyToggle(key)}
            />
          ))}
        </div>
      </section>
    </fieldset>
  );
}

export default EditUnitFields;
