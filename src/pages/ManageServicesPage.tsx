import ManageServicesSections from "../features/services-management/ui/ManageServicesSections";
import { centeredContainerStyle, formStyle } from "../shared/styles/styles";
import PageHeader from "../shared/ui/PageHeader";

function ManageServicesPage() {
  return (
    <div className={centeredContainerStyle}>
      <div className={formStyle}>
        <PageHeader
          title="Manage Services"
          subtitle="Edit units, brands, service zones and specific issues"
        />

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
        />

        <ManageServicesSections />
      </div>
    </div>
  );
}

export default ManageServicesPage;
