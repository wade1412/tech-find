import { useParams } from "react-router";
import { centeredContainerStyle, formStyle } from "../../shared/styles/styles";
import PageHeader from "../../shared/ui/PageHeader";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import UnitForm from "../../features/services-management/manage-units/ui/UnitForm";
import { useUnitQuery } from "../../entities/unit/useUnitQuery";
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
        <PageHeader
          title={unit.name}
          subtitle={`Edit unit details and job capabilities · ${unit.slug}`}
        />

        <UnitForm key={unit.id} unit={unit} />
      </section>
    </div>
  );
}

export default EditUnitPage;
