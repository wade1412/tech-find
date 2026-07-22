import TechnicianList from "../entities/technician/ui/TechnicianList";
import FilterPanel from "../features/technician-filter/ui/FilterPanel";
import { centeredContainerStyle } from "../shared/styles/styles";

export function HomePage() {
  return (
    <div
      data-home-page
      className={`${centeredContainerStyle} min-h-[calc(100dvh-4rem)] w-full`}
    >
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {/* Left Column - filtering options: Units, Brands and others */}
        <div className="min-w-0">
          <FilterPanel />
        </div>

        {/* Right Column - Technicians List */}
        <div className="h-[clamp(30rem,82dvh,56rem)] min-w-0">
          <TechnicianList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
