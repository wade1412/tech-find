import type { Technician } from "../../../../entities/technician/technician.types";
import ErrorMessage from "../../../../shared/ui/ErrorMessage";
import ManagementSectionSkeleton from "../../ui/ManagementSectionSkeleton";
import { useTechnicianIgnoreListEditorData } from "../model/useTechnicianIgnoreListEditorData";
import IgnoreListForm from "./IgnoreListForm";

interface IgnoreListSectionProps {
  technician: Technician;
  onDirtyChange?: (isDirty: boolean) => void;
}

function IgnoreListSection({
  technician,
  onDirtyChange,
}: IgnoreListSectionProps) {
  const {
    technicianIgnoreList,
    units,
    unitsById,
    brands,
    brandsById,
    specificIssues,
    specificIssuesById,
    isPending,
    isError,
    error,
  } = useTechnicianIgnoreListEditorData(technician.id);

  if (isPending) {
    return <ManagementSectionSkeleton variant="ignoreList" />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <IgnoreListForm
      technicianId={technician.id}
      technicianIgnoreList={technicianIgnoreList}
      units={units || []}
      unitsById={unitsById}
      brands={brands || []}
      brandsById={brandsById}
      specificIssues={specificIssues || []}
      specificIssuesById={specificIssuesById}
      onDirtyChange={onDirtyChange}
    />
  );
}

export default IgnoreListSection;
