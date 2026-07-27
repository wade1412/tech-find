import ManageServicesSections from "../../features/services-management/ui/ManageServicesSections";
import { centeredContainerStyle, formStyle } from "../../shared/styles/styles";
import HorizontalDivider from "../../shared/ui/HorizontalDivider";
import PageHeader from "../../shared/ui/PageHeader";

function ManageServicesPage() {
  return (
    <div className={centeredContainerStyle}>
      <div className={formStyle}>
        <PageHeader
          title="Manage Services"
          subtitle="Edit units, brands, service zones and specific issues"
        />

        <HorizontalDivider />

        <ManageServicesSections />
      </div>
    </div>
  );
}

export default ManageServicesPage;
