import { useUnitsQuery } from "../../entities/unit/useUnitsQuery";
import SpecificIssueForm from "../../features/services-management/manage-specific-issues/ui/SpecificIssueForm";
import {
  centeredContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import { InlineSpinner } from "../../shared/ui/Spinners";

function NewSpecificIssuePage() {
  const unitsQuery = useUnitsQuery("active");

  if (unitsQuery.isPending) return <InlineSpinner />;

  if (unitsQuery.isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={unitsQuery.error.message} />
      </div>
    );
  }

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <PageHeader
          title="New Specific Issue"
          subtitle="Create an issue and assign it to an active unit"
        />

        <SpecificIssueForm units={unitsQuery.data} />
      </section>
    </div>
  );
}

export default NewSpecificIssuePage;
