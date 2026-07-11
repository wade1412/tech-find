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
import { formStyle } from "../../../../shared/styles/styles";
import SubmitArea from "../../ui/SubmitArea";
import SubmitSnackbar from "../../ui/SubmitSnackbar";
import TechnicianActiveBar from "./TechnicianActiveBar";

interface ProfileAndCapabilitiesSectionProps {
  technician: Technician;
}

function ProfileAndCapabilitiesSection({
  technician,
}: ProfileAndCapabilitiesSectionProps) {
  const [formState, setFormState] = useState(() =>
    createTechnicianFormState(technician),
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const updateTechnicianMutation = useUpdateTechnicianMutation();

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

    updateTechnicianMutation.mutate(
      {
        id: technician.id,
        patch,
      },
      {
        onSuccess: () => {
          setIsSavedSnackbarOpen(true);
        },
      },
    );
  };

  return (
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
      {/* Head - Technician Active Status */}
      <TechnicianActiveBar
        isActive={formState.active}
        isDisabled={isPending}
        toggleActive={toggleActive}
      />

      {/* Fields */}
      <div className="flex flex-col gap-6 p-2">
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

        {/* Success Snackbar */}
        <SubmitSnackbar
          isOpen={isSavedSnackbarOpen}
          handleClose={() => setIsSavedSnackbarOpen(false)}
        />
      </div>
    </form>
  );
}

export default ProfileAndCapabilitiesSection;
