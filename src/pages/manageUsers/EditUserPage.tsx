import { useParams } from "react-router";
import { useUsersQuery } from "../../entities/user/useUsersQuery";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  formStyle,
  ghostButton,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";

function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: users, isPending, isError, error } = useUsersQuery();

  const selectedUser = users?.find((user) => user.id === userId);

  if (isPending) {
    <div className={centeredContainerStyle}>Loading...</div>;
  }

  if (isError) {
    <div className={centeredContainerStyle}>
      <ErrorMessage message={error?.message} />
    </div>;
  }

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        {/* Header */}
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={selectedUser?.alias || "User Alias"}
            subtitle={selectedUser?.email}
          />

          <button className={ghostButton}>Archive</button>
        </div>

        {/* User Info Form */}
      </section>
    </div>
  );
}

export default EditUserPage;
