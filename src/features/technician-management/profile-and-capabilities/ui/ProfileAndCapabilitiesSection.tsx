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
import SubmitArea from "../../../../shared/ui/manageTechnicians/SubmitArea";

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
    setHasSubmitted(false);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isDirty || hasErrors || isPending) return;

    updateTechnicianMutation.mutate({
      id: technician.id,
      patch,
    });
  };

  return (
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
      {/* Head - Technician Status */}
      <section
        className={`
          flex flex-col gap-3 rounded-xl border px-4 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between
          ${
            formState.active
              ? "border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40"
              : "border-red-200 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20"
          }
        `}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={labelStyle}>Technician status</p>

            <span
              className={`
                rounded-full px-2 py-0.5 text-[11px] font-semibold
                ${
                  formState.active
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-500"
                    : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                }
              `}
            >
              {formState.active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Inactive technicians are excluded from all matching results.
          </p>
        </div>

        <ToggleStatus
          checked={formState.active}
          onChange={toggleActive}
          disabled={isPending}
        />
      </section>

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
