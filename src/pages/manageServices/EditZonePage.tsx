import { useParams } from "react-router";
import { useServiceZoneQuery } from "../../entities/service-zone/useServiceZoneQuery";
import NotFoundPage from "../NotFoundPage";
import { InlineSpinner } from "../../shared/ui/Spinners";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import ZoneForm from "../../features/services-management/manage-service-zones/ui/ZoneForm";
import ArchiveZoneWithConfirmationButton from "../../features/services-management/manage-service-zones/ui/ArchiveZoneWithConfirmationButton";

function EditZonePage() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const { data: zone, isPending, isError, error } = useServiceZoneQuery(zoneId);

  if (!zoneId) return <NotFoundPage />;
  if (isPending) return <InlineSpinner />;

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error?.message} />
      </div>
    );
  }

  if (!zone) return <NotFoundPage />;

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={zone.name}
            subtitle={`Edit zone details · ${zone.slug}`}
          />

          <ArchiveZoneWithConfirmationButton zone={zone} />
        </div>

        <ZoneForm key={zone.id} zone={zone} />
      </section>
    </div>
  );
}

export default EditZonePage;
