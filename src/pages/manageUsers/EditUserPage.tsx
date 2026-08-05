import { useParams } from "react-router";
import { useUsersQuery } from "../../entities/user/useUsersQuery";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import EditUserForm from "../../features/user-management/ui/EditUserForm";
import NotFoundPage from "../NotFoundPage";
import { InlineSpinner } from "../../shared/ui/Spinners";
import { useAuthPermissions } from "../../features/auth/model/useAuthPermissions";
import { getUsersVisibleToRole } from "../../features/user-management/model/userVisibility";
import { useMemo } from "react";
import { roleLabelMap } from "../../entities/user/roles.constants";
import ArchiveUserWithConfirmationButton from "../../features/user-management/archive-user/ui/ArchiveUserWithConfirmationButton";

function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: users, isPending, isError, error } = useUsersQuery();
  const { role } = useAuthPermissions();

  const accessibleUsers = useMemo(
    () => getUsersVisibleToRole(users ?? [], role),
    [users, role],
  );
  const selectedUser = accessibleUsers.find((user) => user.id === userId);

  if (isPending) {
    return <InlineSpinner />;
  }

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error?.message} />
      </div>
    );
  }

  if (!selectedUser) {
    return <NotFoundPage />;
  }

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={selectedUser.alias}
            subtitle={`${selectedUser.full_name} · ${roleLabelMap[selectedUser.role]}`}
          />

          <ArchiveUserWithConfirmationButton user={selectedUser} />
        </div>

        <EditUserForm key={selectedUser.id} user={selectedUser} />
      </section>
    </div>
  );
}

export default EditUserPage;
