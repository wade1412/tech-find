import BrandGroupForm from "../../features/services-management/manage-brands/ui/BrandGroupForm";
import { centeredContainerStyle, formStyle } from "../../shared/styles/styles";
import PageHeader from "../../shared/ui/PageHeader";

function NewBrandGroupPage() {
  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <PageHeader
          title="New Brand Group"
          subtitle="Create a group used to organize brands in service filters"
        />

        <BrandGroupForm />
      </section>
    </div>
  );
}

export default NewBrandGroupPage;
