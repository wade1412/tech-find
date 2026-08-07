import { useNavigate } from "react-router";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { useMemo, useState, type SubmitEvent } from "react";
import type { BrandGroupFormState } from "../model/manage-brands.types";
import {
  buildBrandGroupPatch,
  createBrandGroupFormState,
  EMPTY_BRAND_GROUP_FORM_STATE,
  isNewBrandGroupFormDirty,
  normalizeBrandGroupFormState,
} from "../model/manage-brands.helpers";
import {
  useCreateBrandGroupMutation,
  useUpdateBrandGroupMutation,
} from "../model/useBrandGroupMutations";
import { validateBrandGroupForm } from "../model/manage-brands.validation";
import {
  formStyle,
  formWithPaddingStyle,
} from "../../../../shared/styles/styles";
import ActiveStatusBar from "../../../../shared/ui/ActiveStatusBar";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import EditBrandGroupFields from "./EditBrandGroupFields";
import { useUnsavedChangesGuard } from "../../../../shared/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "../../../../shared/ui/UnsavedChangesDialog";

interface BrandGroupFormProps {
  brandGroup?: BrandGroup;
}
function BrandGroupForm({ brandGroup }: BrandGroupFormProps) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<BrandGroupFormState>(() =>
    brandGroup
      ? createBrandGroupFormState(brandGroup)
      : { ...EMPTY_BRAND_GROUP_FORM_STATE },
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const createMutation = useCreateBrandGroupMutation();
  const updateMutation = useUpdateBrandGroupMutation();
  const mutation = brandGroup ? updateMutation : createMutation;

  const patch = useMemo(
    () => (brandGroup ? buildBrandGroupPatch(brandGroup, formState) : null),
    [brandGroup, formState],
  );
  const errors = validateBrandGroupForm(formState);
  const hasErrors = Object.values(errors).some(Boolean);
  const isDirty = brandGroup
    ? Object.keys(patch ?? {}).length > 0
    : isNewBrandGroupFormDirty(formState);
  const isPending = mutation.isPending;
  const unsavedChanges = useUnsavedChangesGuard(isDirty);

  const setField = (
    key: Exclude<keyof BrandGroupFormState, "active">,
    value: string,
  ) => {
    mutation.reset();
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiscard = () => {
    mutation.reset();
    setHasSubmitted(false);
    setFormState(
      brandGroup
        ? createBrandGroupFormState(brandGroup)
        : { ...EMPTY_BRAND_GROUP_FORM_STATE },
    );
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isDirty || hasErrors || isPending) return;

    try {
      if (brandGroup) {
        await updateMutation.mutateAsync({
          id: brandGroup.id,
          patch: patch ?? {},
        });
        setIsSavedSnackbarOpen(true);
      } else {
        const createdBrandGroup = await createMutation.mutateAsync(
          normalizeBrandGroupFormState(formState),
        );
        unsavedChanges.proceedWithoutPrompt(() =>
          navigate(`/services/brand-groups/${createdBrandGroup.id}/edit`, {
            replace: true,
          }),
        );
      }
    } catch {
      // Submit area renders errors
    }
  };

  return (
    <>
      <form className={formStyle} onSubmit={handleSubmit} noValidate>
      <ActiveStatusBar
        label="Brand Group status"
        activeDescription="Active brand groups and brands related to those groups are available in the brand filters and technician skills configuration."
        inactiveDescription="Inactive brand groups and brands related to those groups stay configured, but are hidden from active workflows."
        isActive={formState.active}
        disabled={isPending}
        onChange={(active) => {
          mutation.reset();
          setFormState((prev) => ({ ...prev, active }));
        }}
      />

      <div className={formWithPaddingStyle}>
        <EditBrandGroupFields
          disabled={isPending}
          errors={hasSubmitted ? errors : null}
          formState={formState}
          onFieldChange={setField}
        />
        <FormSubmitArea
          discardLabel={brandGroup ? "Discard changes" : "Clear form"}
          error={mutation.error}
          errorMessage={mutation.error?.message}
          isDirty={isDirty}
          isPending={isPending}
          onDiscard={handleDiscard}
          pendingLabel={brandGroup ? "Saving..." : "Creating..."}
          submitLabel={brandGroup ? "Save Changes" : "Create Brand Group"}
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

export default BrandGroupForm;
