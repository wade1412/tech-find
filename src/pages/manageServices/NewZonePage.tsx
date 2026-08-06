import ZoneForm from "../../features/services-management/manage-service-zones/ui/ZoneForm";
import { centeredContainerStyle, formStyle } from "../../shared/styles/styles";
import PageHeader from "../../shared/ui/PageHeader";

function NewZonePage() {
  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <PageHeader
          title="New Service Zone"
          subtitle="Create a service zone and configure its profile"
        />

        <ZoneForm />
      </section>
    </div>
  );
}

export default NewZonePage;
