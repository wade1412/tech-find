import { useMemo, useState } from "react";
import type { Technician } from "../../../entities/technician/technician.types";
import ToggleStatus from "../ToggleStatus";
import {
  buildTechnicianPatch,
  createTechnicianFormState,
  formatJobsPerDayRange,
  parseJobsPerDayRange,
} from "./profile.helpers";
import {
  type JobsPerDayDraft,
  type CapabilityFieldKey,
  type ProfileFieldKey,
} from "./profile.types";
import { useUpdateTechnicianMutation } from "../../../features/technician-management/model/useUpdateTechnicianMutation";
import ProfileAndCapabilitiesFields from "./ProfileAndCapabilitiesFields";
import { labelStyle } from "./profile.styles";
import { validateProfileForm } from "./profile.validation";
interface ProfileAndCapacitiesSectionProps {
  technician: Technician;
}

function ProfileAndCapacitiesSection({
  technician,
}: ProfileAndCapacitiesSectionProps) {
  const updateTechnicianMutation = useUpdateTechnicianMutation();

  const [formState, setFormState] = useState(() =>
    createTechnicianFormState(technician),
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formErrorObj = validateProfileForm(formState);
  const hasErrors = Object.values(formErrorObj).some(Boolean);

  const visibleErrors = hasSubmitted ? formErrorObj : null;

  const jobsPerDayRange = useMemo<JobsPerDayDraft>(() => {
    const [min, max] = parseJobsPerDayRange(formState.jobs_per_day);
    return { min: min, max: max ?? min };
  }, [formState.jobs_per_day]);

  const toggleActive = () =>
    setFormState((prev) => ({ ...prev, active: !prev.active }));

  const patch = useMemo(
    () => buildTechnicianPatch(technician, formState),
    [technician, formState],
  );

  const isDirty = Object.keys(patch).length > 0;
  const isPending = updateTechnicianMutation.isPending;

  const onProfileFieldChange = (key: ProfileFieldKey, newValue: string) => {
    setFormState((prev) => ({ ...prev, [key]: newValue }));
  };

  const toggleCapability = (key: CapabilityFieldKey) =>
    setFormState((prev) => ({ ...prev, [key]: !prev[key] }));

  const onJobsPerDayRangeChange = (next: JobsPerDayDraft) =>
    onProfileFieldChange("jobs_per_day", formatJobsPerDayRange(next));

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isDirty || hasErrors) return;

    updateTechnicianMutation.mutate({
      id: technician.id,
      patch,
    });
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      {/* Head - Technician Status */}
      <div
        className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${formState.active ? "border-zinc-200 bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50" : "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20"}`}
      >
        <div>
          <p className={labelStyle}>Technician status</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Inactive technicians are excluded from all matching
          </p>
        </div>
        <ToggleStatus
          checked={formState.active}
          onChange={toggleActive}
          disabled={isPending}
        />
      </div>

      {/* Fields */}
      <ProfileAndCapabilitiesFields
        disabled={isPending}
        formState={formState}
        onProfileFieldChange={onProfileFieldChange}
        onCapabilityToggle={toggleCapability}
        jobsPerDayRange={jobsPerDayRange}
        onJobsPerDayRangeChange={onJobsPerDayRangeChange}
        formError={visibleErrors}
      />

      {/* Submit Button */}
      <div className="flex flex-col gap-2 items-center justify-center p-2">
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {updateTechnicianMutation.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            Failed to save changes. Try again
          </p>
        )}
      </div>
    </form>
  );
}

export default ProfileAndCapacitiesSection;
