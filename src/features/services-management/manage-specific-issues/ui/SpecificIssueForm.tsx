import { useMemo, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import {
  formStyle,
  formWithPaddingStyle,
} from "../../../../shared/styles/styles";
import ActiveStatusBar from "../../../../shared/ui/ActiveStatusBar";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import {
  buildSpecificIssuePatch,
  createSpecificIssueFormState,
  EMPTY_SPECIFIC_ISSUE_FORM_STATE,
  isNewSpecificIssueFormDirty,
  normalizeSpecificIssueFormState,
} from "../model/manage-specific-issues.helpers";
import type {
  EditableSpecificIssueField,
  SpecificIssueFormState,
} from "../model/manage-specific-issues.types";
import {
  getSpecificIssueSaveErrorMessage,
  validateSpecificIssueForm,
} from "../model/manage-specific-issues.validation";
import {
  useCreateSpecificIssueMutation,
  useUpdateSpecificIssueMutation,
} from "../model/useSpecificIssueMutations";
import EditSpecificIssueFields from "./EditSpecificIssueFields";
import { useUnsavedChangesGuard } from "../../../../shared/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "../../../../shared/ui/UnsavedChangesDialog";

interface SpecificIssueFormProps {
  specificIssue?: SpecificIssue;
  units: Unit[];
}

function SpecificIssueForm({ specificIssue, units }: SpecificIssueFormProps) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SpecificIssueFormState>(() =>
    specificIssue
      ? createSpecificIssueFormState(specificIssue)
      : { ...EMPTY_SPECIFIC_ISSUE_FORM_STATE },
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);
  const createMutation = useCreateSpecificIssueMutation();
  const updateMutation = useUpdateSpecificIssueMutation();
  const mutation = specificIssue ? updateMutation : createMutation;

  const patch = useMemo(
    () =>
      specificIssue
        ? buildSpecificIssuePatch(specificIssue, formState)
        : null,
    [formState, specificIssue],
  );
  const errors = validateSpecificIssueForm(formState, units);
  const hasErrors = Object.values(errors).some(Boolean);
  const isDirty = specificIssue
    ? Object.keys(patch ?? {}).length > 0
    : isNewSpecificIssueFormDirty(formState);
  const isPending = mutation.isPending;
  const unsavedChanges = useUnsavedChangesGuard(isDirty);

  const setField = (key: EditableSpecificIssueField, value: string) => {
    mutation.reset();
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const handleDiscard = () => {
    mutation.reset();
    setHasSubmitted(false);
    setFormState(
      specificIssue
        ? createSpecificIssueFormState(specificIssue)
        : { ...EMPTY_SPECIFIC_ISSUE_FORM_STATE },
    );
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isDirty || hasErrors || isPending) return;

    try {
      if (specificIssue) {
        await updateMutation.mutateAsync({
          id: specificIssue.id,
          patch: patch ?? {},
        });
        setIsSavedSnackbarOpen(true);
      } else {
        const createdIssue = await createMutation.mutateAsync(
          normalizeSpecificIssueFormState(formState),
        );
        unsavedChanges.proceedWithoutPrompt(() =>
          navigate(`/services/specific-issues/${createdIssue.id}/edit`, {
            replace: true,
          }),
        );
      }
    } catch {
      // The shared submit area renders the mutation error.
    }
  };

  return (
    <>
      <form className={formStyle} onSubmit={handleSubmit} noValidate>
      <ActiveStatusBar
        label="Specific issue status"
        activeDescription="Active issues are available in technician skills and ignore-list configuration when their unit is active."
        inactiveDescription="Inactive issues stay configured but are hidden from active workflows."
        isActive={formState.active}
        disabled={isPending}
        onChange={(active) => {
          mutation.reset();
          setFormState((previous) => ({ ...previous, active }));
        }}
      />

      <div className={formWithPaddingStyle}>
        <EditSpecificIssueFields
          disabled={isPending}
          errors={hasSubmitted ? errors : null}
          formState={formState}
          onFieldChange={setField}
          units={units}
        />

        <FormSubmitArea
          discardLabel={specificIssue ? "Discard changes" : "Clear form"}
          error={mutation.error}
          errorMessage={getSpecificIssueSaveErrorMessage(mutation.error)}
          isDirty={isDirty}
          isPending={isPending}
          onDiscard={handleDiscard}
          pendingLabel={specificIssue ? "Saving..." : "Creating..."}
          submitLabel={specificIssue ? "Save Changes" : "Create Specific Issue"}
        />
      </div>

      <SaveSuccessSnackbar
        isOpen={isSavedSnackbarOpen}
        onClose={() => setIsSavedSnackbarOpen(false)}
      />
      </form>

      <UnsavedChangesDialog
        isOpen={unsavedChanges.isDialogOpen}
        onLeave={unsavedChanges.leave}
        onStay={unsavedChanges.stay}
      />
    </>
  );
}

export default SpecificIssueForm;
