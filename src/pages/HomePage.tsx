import TechnicianList from "../entities/technician/ui/TechnicianList";
import FilterPanel from "../features/technician-filter/ui/FilterPanel";

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {/* Left Column - filtering options: Units, Brands and others */}
        <FilterPanel />

        {/* Right Column - Technicians List */}
        <TechnicianList />
      </div>
    </div>
  );
}

export default HomePage;
