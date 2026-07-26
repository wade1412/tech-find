import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
interface ManageSpecificIssuesSectionProps {
  specificIssues: SpecificIssue[];
}

function ManageSpecificIssuesSection({
  specificIssues,
}: ManageSpecificIssuesSectionProps) {
  return <div>ManageUnitsSections: {specificIssues.length}</div>;
}

export default ManageSpecificIssuesSection;
