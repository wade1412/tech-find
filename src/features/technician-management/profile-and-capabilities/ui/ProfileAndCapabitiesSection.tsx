import { useMemo, useState } from "react";
import type { Technician } from "../../../../entities/technician/technician.types";
import { useUpdateTechnicianMutation } from "../../model/useUpdateTechnicianMutation";
import {
  buildTechnicianPatch,
  createTechnicianFormState,
  formatJobsPerDayRange,
  parseJobsPerDayRange,
} from "../model/profile.helpers";
import { validateProfileForm } from "../model/profile.validation";
import type {
  CapabilityFieldKey,
  JobsPerDayDraft,
  ProfileFieldKey,
} from "../model/profile.types";
import ProfileAndCapabilitiesFields from "./ProfileAndCapabilitiesFields";
import ToggleStatus from "./ToggleStatus";
import { labelStyle } from "../model/profile.styles";
import { formStyle } from "../../../../shared/styles/styles";
import SubmitArea from "../../../../pages/manageTechnicians/SubmitArea";

interface ProfileAndCapabilitiesSectionProps {
  technician: Technician;
}

function ProfileAndCapabilitiesSection({
  technician,
}: ProfileAndCapabilitiesSectionProps) {
  const updateTechnicianMutation = useUpdateTechnicianMutation();

  const [formState, setFormState] = useState(() =>
    createTechnicianFormState(technician),
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const jobsPerDayRange = useMemo<JobsPerDayDraft>(() => {
    const [min, max] = parseJobsPerDayRange(formState.jobs_per_day);
    return { min: min, max: max ?? min };
  }, [formState.jobs_per_day]);

  const toggleActive = () =>
    setFormState((prev) => ({ ...prev, active: !prev.active }));

  const onProfileFieldChange = (key: ProfileFieldKey, newValue: string) => {
    setFormState((prev) => ({ ...prev, [key]: newValue }));
  };

  const toggleCapability = (key: CapabilityFieldKey) =>
    setFormState((prev) => ({ ...prev, [key]: !prev[key] }));

  const onJobsPerDayRangeChange = (next: JobsPerDayDraft) =>
    onProfileFieldChange("jobs_per_day", formatJobsPerDayRange(next));

  const patch = useMemo(
    () => buildTechnicianPatch(technician, formState),
    [technician, formState],
  );

  const isDirty = Object.keys(patch).length > 0;
  const isPending = updateTechnicianMutation.isPending;

  const formErrorObj = validateProfileForm(formState);
  const hasErrors = Object.values(formErrorObj).some(Boolean);

  const visibleErrors = hasSubmitted ? formErrorObj : null;

  const handleDiscardChanges = () => {
    setFormState(createTechnicianFormState(technician));
  };

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
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
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

      {/* Submit Area */}
      <SubmitArea
        error={updateTechnicianMutation.error}
        isDirty={isDirty}
        isPending={isPending}
        handleDiscardChanges={handleDiscardChanges}
      />
    </form>
  );
}

export default ProfileAndCapabilitiesSection;
