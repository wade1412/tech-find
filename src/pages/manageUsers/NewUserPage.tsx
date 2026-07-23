import NewUserForm from "../../features/user-management/ui/NewUserForm";
import { centeredContainerStyle, formStyle } from "../../shared/styles/styles";
import PageHeader from "../../shared/ui/PageHeader";

function NewUserPage() {
  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <PageHeader
          title="New User"
          subtitle="Fill out the fields to create a new user"
        />

        <NewUserForm />
      </section>
    </div>
  );
}

export default NewUserPage;
