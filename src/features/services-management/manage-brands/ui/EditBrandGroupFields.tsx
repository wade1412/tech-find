import {
  formInputStyle,
  formLabelStyle,
  inputErrorStyle,
  inputHintStyle,
} from "../../../../shared/styles/styles";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import type {
  BrandGroupFormErrors,
  BrandGroupFormState,
} from "../model/manage-brands.types";

type BrandGroupTextField = "name" | "slug";
type EditableBrandGroupField = Exclude<keyof BrandGroupFormState, "active">;

interface EditBrandGroupFieldsProps {
  disabled: boolean;
  errors: BrandGroupFormErrors | null;
  formState: BrandGroupFormState;
  onFieldChange: (key: EditableBrandGroupField, value: string) => void;
}

const TEXT_FIELDS: ReadonlyArray<{
  key: BrandGroupTextField;
  label: string;
}> = [
  { key: "name", label: "Group name" },
  { key: "slug", label: "Slug" },
];

function EditBrandGroupFields({
  disabled,
  errors,
  formState,
  onFieldChange,
}: EditBrandGroupFieldsProps) {
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-5">
      <SectionHeader
        label="Brand Group Profile"
        subtext="Edit the group name, stable slug and display order"
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

        <div>
          <label
            htmlFor="display_order"
            className={`flex flex-col gap-1.5 ${formLabelStyle}`}
          >
            Display order
            <input
              id="display_order"
              name="display_order"
              type="number"
              inputMode="numeric"
              min="0"
              max="9999"
              value={formState.display_order}
              onChange={(event) =>
                onFieldChange("display_order", event.target.value)
              }
              aria-invalid={Boolean(errors?.display_order)}
              aria-describedby={
                errors?.display_order
                  ? "display-order-help display_order-error"
                  : "display-order-help"
              }
              className={formInputStyle}
            />
          </label>

          <p id="display-order-help" className={inputHintStyle}>
            Controls the position on the filter panel. Leave gaps such as 10,
            20, 30 so a new group can be inserted later as 15 without
            renumbering the full list.
          </p>

          {errors?.display_order && (
            <p
              id="display_order-error"
              role="alert"
              className={inputErrorStyle}
            >
              {errors.display_order}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}

export default EditBrandGroupFields;
