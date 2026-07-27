import UnitForm from "../../features/services-management/manage-units/ui/UnitForm";
import { centeredContainerStyle, formStyle } from "../../shared/styles/styles";
import PageHeader from "../../shared/ui/PageHeader";

function NewUnitPage() {
  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <PageHeader
          title="New Unit"
          subtitle="Create a unit and configure its supported properties"
        />

        <UnitForm />
      </section>
    </div>
  );
}

export default NewUnitPage;
