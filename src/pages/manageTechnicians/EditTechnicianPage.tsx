import { useState } from "react";
import PageHeader from "../../shared/ui/PageHeader";
import EditTechnicianSectionCard from "./EditTechnicianSectionCard";

const editSections = [
  { id: "1", title: "Profile & Capacities" },
  { id: "2", title: "Service Zones" },
  { id: "3", title: "Skills" },
  { id: "4", title: "Ignore List" },
];

function EditTechnicianPage() {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );

  const onSectionToggle = (id: string) =>
    setSelectedSectionId((prev) => (prev === id ? null : id));

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <section className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <PageHeader
            title="Technician Alias"
            subtitle="Zones and other info"
          />
        </div>

        {/* Sections Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {editSections.map((section) => (
            <EditTechnicianSectionCard
              key={section.id}
              id={section.id}
              title={section.title}
              selectedSectionId={selectedSectionId}
              onToggle={() => onSectionToggle(section.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default EditTechnicianPage;
