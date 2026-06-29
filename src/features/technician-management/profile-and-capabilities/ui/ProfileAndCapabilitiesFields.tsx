import { headingStyleDefault } from "../../../../shared/styles/styles";
import Checkbox from "../../../../shared/ui/Checkbox";
import { CAPABILITY_FIELDS, PROFILE_FIELDS } from "../model/profile.constants";
import { inputStyle, labelStyle } from "../model/profile.styles";
import type {
  CapabilityFieldKey,
  JobsPerDayDraft,
  ProfileFieldKey,
  TechnicianFormState,
} from "../model/profile.types";
import type { ProfileValidationErrors } from "../model/profile.validation";
import JobsPerDayRangeSelect from "./JobsPerDayRangeSelect";

interface ProfileAndCapabilitiesFieldsProps {
  disabled: boolean;
  formState: TechnicianFormState;
  onProfileFieldChange: (key: ProfileFieldKey, newValue: string) => void;
  onCapabilityToggle: (key: CapabilityFieldKey) => void;
  jobsPerDayRange: JobsPerDayDraft;
  onJobsPerDayRangeChange: (next: JobsPerDayDraft) => void;
  formError: ProfileValidationErrors | null;
}

function ProfileAndCapabilitiesFields({
  disabled,
  formState,
  onProfileFieldChange,
  onCapabilityToggle,
  jobsPerDayRange,
  onJobsPerDayRangeChange,
  formError,
}: ProfileAndCapabilitiesFieldsProps) {
  const renderProfileField = (key: ProfileFieldKey) => {
    switch (key) {
      case "home_zip_code":
        return (
          <input
            id={key}
            type="text"
            inputMode="numeric"
            maxLength={5}
            autoComplete="postal-code"
            name={key}
            value={formState[key]}
            onChange={(e) => onProfileFieldChange(key, e.target.value)}
            className={inputStyle}
          />
        );

      case "jobs_per_day":
        return (
          <JobsPerDayRangeSelect
            disabled={disabled}
            value={jobsPerDayRange}
            onChange={onJobsPerDayRangeChange}
          />
        );

      case "notes":
        return (
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formState[key] ?? ""}
            onChange={(e) => onProfileFieldChange(key, e.target.value)}
            className={`${inputStyle} resize-none`}
          />
        );

      default:
        return (
          // Name and Alias
          <input
            id={key}
            name={key}
            value={formState[key]}
            onChange={(e) => onProfileFieldChange(key, e.target.value)}
            className={inputStyle}
          />
        );
    }
  };

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className={headingStyleDefault}>Profile</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PROFILE_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className={`flex flex-col gap-1.5 ${labelStyle}`}>
                {label}
                {renderProfileField(key)}
              </label>

              {formError?.[key] && (
                <span
                  role="alert"
                  className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {formError[key]}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={headingStyleDefault}>Capabilities</h2>
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
