import { useParams } from "react-router";
import { useUnitQuery } from "../../entities/unit/useUnitQuery";
import ArchiveUnitWithConfirmationButton from "../../features/services-management/manage-units/archive-unit/ui/ArchiveUnitWithConfirmationButton";
import UnitForm from "../../features/services-management/manage-units/ui/UnitForm";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import { InlineSpinner } from "../../shared/ui/Spinners";
import NotFoundPage from "../NotFoundPage";

function EditUnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { data: unit, isPending, isError, error } = useUnitQuery(unitId);

  if (!unitId) return <NotFoundPage />;
  if (isPending) return <InlineSpinner />;

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error?.message} />
      </div>
    );
  }

  if (!unit) return <NotFoundPage />;

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={unit.name}
            subtitle={`Edit unit details and job capabilities · ${unit.slug}`}
          />

          <ArchiveUnitWithConfirmationButton unit={unit} />
        </div>

        <UnitForm key={unit.id} unit={unit} />
      </section>
    </div>
  );
}

export default EditUnitPage;
