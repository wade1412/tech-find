import { useNewTechnicianData } from "../../features/technician-management/new-technician/model/useNewTechnicianData";
import EditTechnicianSkeleton from "../../features/technician-management/ui/EditTechnicianSkeleton";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import NewTechnicianForm from "./NewTechnicianForm";

function NewTechnicianPage() {
  const {
    units,
    unitsById,
    brands,
    brandsById,
    brandGroups,
    brandGroupById,
    specificIssues,
    specificIssuesById,
    zones,
    isPending,
    isError,
    error,
  } = useNewTechnicianData();

  if (isPending) {
    return <EditTechnicianSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <ErrorMessage message={error?.message} />
      </div>
    );
  }

  return (
    <NewTechnicianForm
      units={units || []}
      unitsById={unitsById}
      brands={brands || []}
      brandsById={brandsById}
      brandGroups={brandGroups || []}
      brandGroupById={brandGroupById}
      specificIssues={specificIssues || []}
      specificIssuesById={specificIssuesById}
      zones={zones || []}
    />
  );
}

export default NewTechnicianPage;
