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
import {
  formStyle,
  formWithPaddingStyle,
} from "../../../../shared/styles/styles";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import ActiveStatusBar from "../../../../shared/ui/ActiveStatusBar";

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

  const setActive = (active: boolean) =>
    setFormState((prev) => ({ ...prev, active }));

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
      <ActiveStatusBar
        label="Technician status"
        activeDescription="Active technicians are included in matching results."
        inactiveDescription="Inactive technicians are excluded from all matching results."
        isActive={formState.active}
        disabled={isPending}
        onChange={setActive}
      />

      {/* Fields */}
      <div className={formWithPaddingStyle}>
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
        <FormSubmitArea
          error={updateTechnicianMutation.error}
          isDirty={isDirty}
          isPending={isPending}
          onDiscard={handleDiscardChanges}
        />

        {/* Success Snackbar */}
        <SaveSuccessSnackbar
          isOpen={isSavedSnackbarOpen}
          onClose={() => setIsSavedSnackbarOpen(false)}
        />
      </div>
    </form>
  );
}

export default ProfileAndCapabilitiesSection;
