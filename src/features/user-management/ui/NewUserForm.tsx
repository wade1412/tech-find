import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import type { AppRole } from "../../../entities/user/user.types";
import { formStyle, formWithPaddingStyle } from "../../../shared/styles/styles";
import FormSubmitArea from "../../../shared/ui/FormSubmitArea";
import SectionHeader from "../../../shared/ui/SectionHeader";
import { useAuthPermissions } from "../../auth/model/useAuthPermissions";
import {
  buildCreateUserInput,
  EMPTY_USER_FORM_STATE,
  getCreatableUserRoles,
  isNewUserFormDirty,
} from "../model/editUser.helpers";
import type { EditableUserTextField } from "../model/editUser.types";
import { validateUserForm } from "../model/editUser.validation";
import { useCreateUserMutation } from "../model/useCreateUserMutation";
import EditUserFields from "./EditUserFields";

function NewUserForm() {
  const navigate = useNavigate();
  const { role: actorRole } = useAuthPermissions();
  const [formState, setFormState] = useState(() => ({
    ...EMPTY_USER_FORM_STATE,
  }));
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const createUserMutation = useCreateUserMutation();

  const allowedRoles = getCreatableUserRoles(actorRole);
  const formErrors = validateUserForm(formState);
  const visibleErrors = hasSubmitted ? formErrors : null;
  const hasValidationErrors = Object.values(formErrors).some(Boolean);
  const isDirty = isNewUserFormDirty(formState);
  const isPending = createUserMutation.isPending;

  const handleTextChange = (key: EditableUserTextField, value: string) => {
    createUserMutation.reset();
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const handleRoleChange = (role: AppRole) => {
    createUserMutation.reset();
    setFormState((previous) => ({ ...previous, role }));
  };

  const handleDiscardChanges = () => {
    setFormState({ ...EMPTY_USER_FORM_STATE });
    setHasSubmitted(false);
    createUserMutation.reset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (
      hasValidationErrors ||
      !isDirty ||
      isPending ||
      !allowedRoles.includes(formState.role)
    ) {
      return;
    }

    try {
      const redirectTo = new URL(
        "/secure-email-link",
        window.location.origin,
      ).toString();
      const createdUser = await createUserMutation.mutateAsync(
        buildCreateUserInput(formState, redirectTo),
      );

      navigate(`/users/${createdUser.id}/edit`, {
        replace: true,
        state: { userCreated: true },
      });
    } catch {
      // The mutation shows the server error in the submit area.
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={formStyle}>
      <div className={formWithPaddingStyle}>
        <div className="flex min-w-0 flex-col gap-3">
          <SectionHeader
            label="User Profile"
            subtext="Enter the user's name, sign-in email, and access role"
          />

          <EditUserFields
            formState={formState}
            errors={visibleErrors}
            allowedRoles={allowedRoles}
            disabledProfile={isPending}
            disabledAccess={isPending}
            onTextChange={handleTextChange}
            onRoleChange={handleRoleChange}
          />

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            The user will receive a secure email invitation to create their
            password. New accounts start active.
          </p>
        </div>

        <FormSubmitArea
          discardLabel="Clear form"
          error={createUserMutation.error}
          errorMessage={createUserMutation.error?.message}
          isDirty={isDirty}
          isPending={isPending}
          onDiscard={handleDiscardChanges}
          pendingLabel="Creating..."
          submitLabel="Create User"
        />
      </div>
    </form>
  );
}

export default NewUserForm;
