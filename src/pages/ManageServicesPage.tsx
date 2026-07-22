import SectionHeader from "../shared/ui/SectionHeader";

function ManageServicesPage() {
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="flex flex-col gap-10">
        <SectionHeader
          label="Manage Services"
          subtext="Edit units, brand and service zones"
        />

        <span className="text-base text-zinc-300 text-center">
          Work In Progress, come back later
        </span>
      </div>
    </div>
  );
}

export default ManageServicesPage;
