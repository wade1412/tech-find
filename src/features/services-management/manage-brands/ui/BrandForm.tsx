import { useMemo, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import {
  formStyle,
  formWithPaddingStyle,
} from "../../../../shared/styles/styles";
import ActiveStatusBar from "../../../../shared/ui/ActiveStatusBar";
import {
  buildBrandPatch,
  createBrandFormState,
  EMPTY_BRAND_FORM_STATE,
  isNewBrandFormDirty,
  normalizeBrandFormState,
} from "../model/manage-brands.helpers";
import type { BrandFormState } from "../model/manage-brands.types";
import {
  getBrandSaveErrorMessage,
  validateBrandForm,
} from "../model/manage-brands.validation";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "../model/useBrandMutations";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import EditBrandFields from "./EditBrandFields";

interface BrandFormProps {
  brand?: Brand;
  brandGroups: BrandGroup[];
}

function BrandForm({ brand, brandGroups }: BrandFormProps) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<BrandFormState>(() =>
    brand ? createBrandFormState(brand) : { ...EMPTY_BRAND_FORM_STATE },
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const createMutation = useCreateBrandMutation();
  const updateMutation = useUpdateBrandMutation();
  const mutation = brand ? updateMutation : createMutation;

  const patch = useMemo(
    () => (brand ? buildBrandPatch(brand, formState) : null),
    [formState, brand],
  );
  const errors = validateBrandForm(formState, brandGroups);
  const hasErrors = Object.values(errors).some(Boolean);
  const isDirty = brand
    ? Object.keys(patch ?? {}).length > 0
    : isNewBrandFormDirty(formState);
  const isPending = mutation.isPending;

  const setField = (key: keyof BrandFormState, value: string) => {
    mutation.reset();
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const handleDiscard = () => {
    mutation.reset();
    setHasSubmitted(false);
    setFormState(
      brand ? createBrandFormState(brand) : { ...EMPTY_BRAND_FORM_STATE },
    );
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isDirty || hasErrors || isPending) return;

    try {
      if (brand) {
        await updateMutation.mutateAsync({
          id: brand.id,
          patch: patch ?? {},
        });
        setIsSavedSnackbarOpen(true);
      } else {
        const createdBrand = await createMutation.mutateAsync(
          normalizeBrandFormState(formState),
        );
        navigate(`/services/brands/${createdBrand.id}/edit`, {
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
        label="Brand status"
        activeDescription="Active brands are available in brand filters and technician ignore list configuration."
        inactiveDescription="Inactive brands stay configured, but are hidden from active workflows."
        isActive={formState.active}
        disabled={isPending}
        onChange={(active) => {
          mutation.reset();
          setFormState((previous) => ({ ...previous, active }));
        }}
      />
      <div className={formWithPaddingStyle}>
        <EditBrandFields
          brandGroups={brandGroups}
          disabled={isPending}
          errors={hasSubmitted ? errors : null}
          formState={formState}
          onFieldChange={setField}
        />

        <FormSubmitArea
          discardLabel={brand ? "Discard changes" : "Clear form"}
          error={mutation.error}
          errorMessage={getBrandSaveErrorMessage(mutation.error)}
          isDirty={isDirty}
          isPending={isPending}
          onDiscard={handleDiscard}
          pendingLabel={brand ? "Saving..." : "Creating..."}
          submitLabel={brand ? "Save Changes" : "Create Brand"}
        />
      </div>

      <SaveSuccessSnackbar
        isOpen={isSavedSnackbarOpen}
        onClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default BrandForm;
