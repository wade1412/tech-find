import Checkbox from "../../../../shared/ui/Checkbox";
import SectionHeader from "../../../../pages/manageTechnicians/ui/SectionHeader";
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
    const errorMessage = formError?.[key];
    const errorId = `${key}-error`;

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
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorId : undefined}
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
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorId : undefined}
            className={`${inputStyle} resize-none`}
          />
        );

      default:
        return (
          <input
            id={key}
            name={key}
            value={formState[key]}
            onChange={(e) => onProfileFieldChange(key, e.target.value)}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorId : undefined}
            className={inputStyle}
          />
        );
    }
  };

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,0.9fr)] md:gap-6">
        <section className="flex min-w-0 flex-col gap-3">
          <SectionHeader
            label="Profile"
            subtext="Edit technician identity, capacity, ZIP code, and internal notes"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {PROFILE_FIELDS.map(({ key, label }) => {
              const errorMessage = formError?.[key];
              const errorId = `${key}-error`;

              return (
                <div
                  key={key}
                  className={key === "notes" ? "md:col-span-2" : ""}
                >
                  <label className={`flex flex-col gap-1.5 ${labelStyle}`}>
                    {label}
                    {renderProfileField(key)}
                  </label>

                  {errorMessage && (
                    <span
                      id={errorId}
                      role="alert"
                      className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                    >
                      {errorMessage}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-zinc-200 md:h-auto md:w-px md:self-stretch dark:bg-zinc-800"
        />

        {/* Capabilities */}
        <section className="flex min-w-0 flex-col gap-3">
          <SectionHeader
            label="Capabilities"
            subtext="Control what job types this technician can be matched with"
          />

          <div className="grid grid-cols-1 gap-2.5">
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
      </div>
    </fieldset>
  );
}

export default ProfileAndCapabilitiesFields;
