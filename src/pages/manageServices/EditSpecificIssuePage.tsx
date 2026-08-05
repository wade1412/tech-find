import { useMemo } from "react";
import { useParams } from "react-router";
import { useSpecificIssueQuery } from "../../entities/specific-issue/useSpecificIssueQuery";
import { useUnitsQuery } from "../../entities/unit/useUnitsQuery";
import ArchiveSpecificIssueWithConfirmationButton from "../../features/services-management/manage-specific-issues/ui/ArchiveSpecificIssueWithConfirmationButton";
import SpecificIssueForm from "../../features/services-management/manage-specific-issues/ui/SpecificIssueForm";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import { InlineSpinner } from "../../shared/ui/Spinners";
import NotFoundPage from "../NotFoundPage";

function EditSpecificIssuePage() {
  const { specificIssueId } = useParams<{ specificIssueId: string }>();
  const issueQuery = useSpecificIssueQuery(specificIssueId);
  const unitsQuery = useUnitsQuery("all");
  const unitsById = useMemo(
    () => new Map((unitsQuery.data ?? []).map((unit) => [unit.id, unit])),
    [unitsQuery.data],
  );
  const isPending = issueQuery.isPending || unitsQuery.isPending;
  const error = issueQuery.error ?? unitsQuery.error;

  if (!specificIssueId) return <NotFoundPage />;
  if (isPending) return <InlineSpinner />;

  if (error) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!issueQuery.data) return <NotFoundPage />;

  const specificIssue = issueQuery.data;
  const unit = unitsById.get(specificIssue.unit_id);

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={specificIssue.name}
            subtitle={`Edit specific issue · ${unit?.name ?? "Unknown unit"} · ${specificIssue.slug}`}
          />

          <ArchiveSpecificIssueWithConfirmationButton
            specificIssue={specificIssue}
          />
        </div>

        <SpecificIssueForm
          key={specificIssue.id}
          specificIssue={specificIssue}
          units={unitsQuery.data ?? []}
        />
      </section>
    </div>
  );
}

export default EditSpecificIssuePage;
