import { useMemo, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import type { Unit } from "../../../../entities/unit/unit.types";
import {
  formStyle,
  formWithPaddingStyle,
} from "../../../../shared/styles/styles";
import ActiveStatusBar from "../../../../shared/ui/ActiveStatusBar";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import {
  buildUnitPatch,
  createUnitFormState,
  EMPTY_UNIT_FORM_STATE,
  isNewUnitFormDirty,
  normalizeUnitFormState,
} from "../model/manage-units.helpers";
import type {
  UnitFormState,
  UnitProfileFieldKey,
  UnitPropertyFieldKey,
} from "../model/manage-units.types";
import { validateUnitForm } from "../model/manage-units.validation";
import {
  useCreateUnitMutation,
  useUpdateUnitMutation,
} from "../model/useUnitMutations";
import EditUnitFields from "./EditUnitFields";

interface UnitFormProps {
  unit?: Unit;
}

function UnitForm({ unit }: UnitFormProps) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<UnitFormState>(() =>
    unit ? createUnitFormState(unit) : { ...EMPTY_UNIT_FORM_STATE },
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);
  const createMutation = useCreateUnitMutation();
  const updateMutation = useUpdateUnitMutation();
  const mutation = unit ? updateMutation : createMutation;

  const patch = useMemo(
    () => (unit ? buildUnitPatch(unit, formState) : null),
    [formState, unit],
  );
  const errors = validateUnitForm(formState);
  const hasErrors = Object.values(errors).some(Boolean);
  const isDirty = unit
    ? Object.keys(patch ?? {}).length > 0
    : isNewUnitFormDirty(formState);
  const isPending = mutation.isPending;

  const setProfileField = (key: UnitProfileFieldKey, value: string) => {
    mutation.reset();
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const toggleProperty = (key: UnitPropertyFieldKey) => {
    mutation.reset();
    setFormState((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const handleDiscard = () => {
    mutation.reset();
    setHasSubmitted(false);
    setFormState(
      unit ? createUnitFormState(unit) : { ...EMPTY_UNIT_FORM_STATE },
    );
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isDirty || hasErrors || isPending) return;

    try {
      if (unit) {
        await updateMutation.mutateAsync({
          id: unit.id,
          patch: patch ?? {},
        });
        setIsSavedSnackbarOpen(true);
      } else {
        const createdUnit = await createMutation.mutateAsync(
          normalizeUnitFormState(formState),
        );
        navigate(`/services/units/${createdUnit.id}/edit`, {
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
        label="Unit status"
        activeDescription="Active units are available in filters and technician skill configuration."
        inactiveDescription="Inactive units stay configured but are hidden from active workflows."
        isActive={formState.active}
        disabled={isPending}
        onChange={(active) => {
          mutation.reset();
          setFormState((previous) => ({ ...previous, active }));
        }}
      />

      <div className={formWithPaddingStyle}>
        <EditUnitFields
          disabled={isPending}
          errors={hasSubmitted ? errors : null}
          formState={formState}
          onProfileChange={setProfileField}
          onPropertyToggle={toggleProperty}
        />

        <FormSubmitArea
          discardLabel={unit ? "Discard changes" : "Clear form"}
          error={mutation.error}
          errorMessage={
            mutation.error?.message.includes("duplicate key")
              ? "A unit with this name or slug already exists."
              : mutation.error?.message
          }
          isDirty={isDirty}
          isPending={isPending}
          onDiscard={handleDiscard}
          pendingLabel={unit ? "Saving..." : "Creating..."}
          submitLabel={unit ? "Save Changes" : "Create Unit"}
        />
      </div>

      <SaveSuccessSnackbar
        isOpen={isSavedSnackbarOpen}
        onClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default UnitForm;
