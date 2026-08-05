import { useNavigate } from "react-router";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { useMemo, useState, type SubmitEvent } from "react";
import {
  buildZonePatch,
  createZoneFormState,
  EMPTY_ZONE_FORM_STATE,
  isNewZoneFormDirty,
  normalizeZoneFormState,
} from "../model/manage-zones.helpers";
import type { ZoneFieldKey, ZoneFormState } from "../model/manage-zones.types";
import {
  useCreateServiceZoneMutation,
  useUpdateServiceZoneMutation,
} from "../model/useServiceZoneMutations";
import { validateZoneForm } from "../model/manage-zones.validation";
import {
  formStyle,
  formWithPaddingStyle,
} from "../../../../shared/styles/styles";
import ActiveStatusBar from "../../../../shared/ui/ActiveStatusBar";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import EditZoneFields from "./EditZoneFields";

interface ZoneFormProps {
  zone?: ServiceZone;
}

function ZoneForm({ zone }: ZoneFormProps) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<ZoneFormState>(() =>
    zone ? createZoneFormState(zone) : { ...EMPTY_ZONE_FORM_STATE },
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const createMutation = useCreateServiceZoneMutation();
  const updateMutation = useUpdateServiceZoneMutation();
  const mutation = zone ? updateMutation : createMutation;

  const patch = useMemo(
    () => (zone ? buildZonePatch(zone, formState) : null),
    [zone, formState],
  );
  const errors = validateZoneForm(formState);
  const hasErrors = Object.values(errors).some(Boolean);
  const isDirty = zone
    ? Object.keys(patch ?? {}).length > 0
    : isNewZoneFormDirty(formState);
  const isPending = mutation.isPending;

  const setZoneField = (key: ZoneFieldKey, value: string) => {
    mutation.reset();
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDiscard = () => {
    mutation.reset();
    setHasSubmitted(false);
    setFormState(
      zone ? createZoneFormState(zone) : { ...EMPTY_ZONE_FORM_STATE },
    );
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isDirty || hasErrors || isPending) return;

    try {
      if (zone) {
        await updateMutation.mutateAsync({
          id: zone.id,
          patch: patch ?? {},
        });
        setIsSavedSnackbarOpen(true);
      } else {
        const createZone = await createMutation.mutateAsync(
          normalizeZoneFormState(formState),
        );
        navigate(`/services/zones/${createZone.id}/edit`, {
          replace: true,
        });
      }
    } catch {
      // The shared submit area renders the mutation error.
    }
  };

  return (
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
      <ActiveStatusBar
        label="Zone status"
        activeDescription="Active zone are available in filters and technician configuration."
        inactiveDescription="Inactive zones stay configured but are hidden from active workflows."
        isActive={formState.active}
        disabled={isPending}
        onChange={(active) => {
          mutation.reset();
          setFormState((previous) => ({ ...previous, active }));
        }}
      />

      <div className={formWithPaddingStyle}>
        <EditZoneFields
          disabled={isPending}
          errors={hasSubmitted ? errors : null}
          formState={formState}
          onFieldChange={setZoneField}
        />

        <FormSubmitArea
          discardLabel={zone ? "Discard changes" : "Clear form"}
          error={mutation.error}
          errorMessage={
            mutation.error?.message.includes("duplicate key")
              ? "A zone with this name or slug already exists."
              : mutation.error?.message
          }
          isDirty={isDirty}
          isPending={isPending}
          onDiscard={handleDiscard}
          pendingLabel={zone ? "Saving..." : "Creating..."}
          submitLabel={zone ? "Save Changes" : "Create Zone"}
        />
      </div>

      <SaveSuccessSnackbar
        isOpen={isSavedSnackbarOpen}
        onClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default ZoneForm;
