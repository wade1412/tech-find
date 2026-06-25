import Checkbox from "../../../shared/ui/Checkbox";
import { CAPABILITY_FIELDS, PROFILE_FIELDS } from "./profile.constants";
import { inputStyle, labelStyle } from "./profile.styles";
import type {
  CapabilityFieldKey,
  ProfileFieldKey,
  TechnicianFormState,
} from "./profile.types";

interface ProfileAndCapacitiesFieldsProps {
  disabled: boolean;
  formState: TechnicianFormState;
  onProfileFieldChange: (key: ProfileFieldKey, newValue: string) => void;
  onCapabilityToggle: (key: CapabilityFieldKey) => void;
}

function ProfileAndCapabilitiesFields({
  disabled,
  formState,
  onProfileFieldChange,
  onCapabilityToggle,
}: ProfileAndCapacitiesFieldsProps) {
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-6">
      {/* Profile Fields */}

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Profile
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PROFILE_FIELDS.map(({ key, label }) => {
            if (key === "notes") {
              return (
                <div key={key}>
                  <label className={`flex flex-col gap-1.5 ${labelStyle}`}>
                    Notes
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formState[key] ?? ""}
                      onChange={(e) =>
                        onProfileFieldChange(key, e.target.value)
                      }
                      className={`${inputStyle} resize-none`}
                    />
                  </label>
                </div>
              );
            } else if (key === "home_zip_code") {
              return (
                <div key={key}>
                  <label
                    key={key}
                    className={`flex flex-col gap-1.5 ${labelStyle}`}
                  >
                    {label}
                    <input
                      id={key}
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      autoComplete="postal-code"
                      name={key}
                      value={formState[key]}
                      onChange={(e) =>
                        onProfileFieldChange(key, e.target.value)
                      }
                      className={inputStyle}
                    />
                  </label>
                </div>
              );
            } else
              return (
                <div key={key}>
                  <label
                    key={key}
                    className={`flex flex-col gap-1.5 ${labelStyle}`}
                  >
                    {label}
                    <input
                      id={key}
                      name={key}
                      value={formState[key]}
                      onChange={(e) =>
                        onProfileFieldChange(key, e.target.value)
                      }
                      className={inputStyle}
                    />
                  </label>
                </div>
              );
          })}
        </div>
      </section>

      {/* Capabilites */}
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Capabilities
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CAPABILITY_FIELDS.map(({ key, label }) => (
            <Checkbox
              key={key}
              id={key}
              label={label}
              checked={formState[key]}
              onChange={() => onCapabilityToggle(key)}
            />
          ))}
        </div>
      </section>
    </fieldset>
  );
}

export default ProfileAndCapabilitiesFields;
