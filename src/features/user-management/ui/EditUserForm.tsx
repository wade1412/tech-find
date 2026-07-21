import { useState, type FormEvent } from "react";
import type { AppRole, User } from "../../../entities/user/user.types";
import { useAuth } from "../../auth/model/AuthContext";
import { useAuthPermissions } from "../../auth/model/useAuthPermissions";
import ActiveStatusBar from "../../../shared/ui/ActiveStatusBar";
import FormSubmitArea from "../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../shared/ui/SaveSuccessSnackbar";
import {
  buildUpdateUserInput,
  createUserFormState,
  getUserEditCapabilities,
  isUserFormDirty,
} from "../model/editUser.helpers";
import type { EditableUserTextField } from "../model/editUser.types";
import { validateUserForm } from "../model/editUser.validation";
import { useUpdateUserMutation } from "../model/useUpdateUserMutation";
import EditUserFields from "./EditUserFields";

function EditUserForm({ user }: { user: User }) {
  const { profile, retryProfile } = useAuth();
  const { role: actorRole } = useAuthPermissions();
  const [formState, setFormState] = useState(() =>
    createUserFormState(user),
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);
  const updateUserMutation = useUpdateUserMutation();

  const capabilities = getUserEditCapabilities({
    actorId: profile?.id,
    actorRole,
    target: user,
  });
  const formErrors = validateUserForm(formState);
  const visibleErrors = hasSubmitted ? formErrors : null;
  const hasValidationErrors = Object.values(formErrors).some(Boolean);
  const isDirty = isUserFormDirty(user, formState);
  const isPending = updateUserMutation.isPending;

  const handleTextChange = (key: EditableUserTextField, value: string) => {
    updateUserMutation.reset();
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const handleRoleChange = (role: AppRole) => {
    updateUserMutation.reset();
    setFormState((previous) => ({ ...previous, role }));
  };

  const handleActiveChange = (active: boolean) => {
    updateUserMutation.reset();
    setFormState((previous) => ({ ...previous, active }));
  };

  const handleDiscardChanges = () => {
    setFormState(createUserFormState(user));
    setHasSubmitted(false);
    updateUserMutation.reset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (
      hasValidationErrors ||
      !isDirty ||
      !capabilities.canEditProfile ||
      isPending
    ) {
      return;
    }

    const accessChanged =
      formState.active !== user.active || formState.role !== user.role;

    if (accessChanged && !capabilities.canEditAccess) return;
    if (
      formState.role !== user.role &&
      !capabilities.allowedRoles.includes(formState.role)
    ) {
      return;
    }

    try {
      const updatedUser = await updateUserMutation.mutateAsync(
        buildUpdateUserInput(user.id, formState),
      );
      setFormState(createUserFormState(updatedUser));
      setHasSubmitted(false);
      setIsSavedSnackbarOpen(true);

      if (profile?.id === updatedUser.id) {
        await retryProfile();
      }
    } catch {
      // The mutation exposes the server error in the submit area.
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-2">
      <ActiveStatusBar
        label="User access"
        isActive={formState.active}
        disabled={!capabilities.canEditAccess || isPending}
        onChange={handleActiveChange}
        activeDescription="This user can sign in and access features allowed by their role."
        inactiveDescription="This user is blocked from signing in and refreshing sessions."
      />

      {capabilities.message && (
        <p className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
          {capabilities.message}
        </p>
      )}

      <EditUserFields
        formState={formState}
        errors={visibleErrors}
        allowedRoles={capabilities.allowedRoles}
        disabledProfile={!capabilities.canEditProfile || isPending}
        disabledAccess={!capabilities.canEditAccess || isPending}
        onTextChange={handleTextChange}
        onRoleChange={handleRoleChange}
      />

      <FormSubmitArea
        error={updateUserMutation.error}
        errorMessage={updateUserMutation.error?.message}
        isDirty={isDirty && capabilities.canEditProfile}
        isPending={isPending}
        onDiscard={handleDiscardChanges}
      />

      <SaveSuccessSnackbar
        isOpen={isSavedSnackbarOpen}
        onClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default EditUserForm;
