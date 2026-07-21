import { useParams } from "react-router";
import { useUsersQuery } from "../../entities/user/useUsersQuery";
import {
  centeredContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import EditUserForm from "../../features/user-management/ui/EditUserForm";
import NotFoundPage from "../NotFoundPage";
import { InlineSpinner } from "../../shared/ui/Spinners";

function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: users, isPending, isError, error } = useUsersQuery();

  const selectedUser = users?.find((user) => user.id === userId);

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
        <PageHeader
          title={selectedUser.alias}
          subtitle={`${selectedUser.full_name} · ${selectedUser.email}`}
        />

        <EditUserForm key={selectedUser.id} user={selectedUser} />
      </section>
    </div>
  );
}

export default EditUserPage;
