import TechnicianList from "../entities/technician/ui/TechnicianList";
import FilterPanel from "../features/technician-filter/ui/FilterPanel";
import { centeredContainerStyle } from "../shared/styles/styles";

export function HomePage() {
  return (
    <div
      data-home-page
      className={`${centeredContainerStyle} flex min-h-0 w-full flex-1 flex-col`}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] items-stretch gap-6 md:grid-cols-2 md:grid-rows-1">
        {/* Left Column - filtering options: Units, Brands and others */}
        <div className="min-w-0">
          <FilterPanel />
        </div>

        {/* Right Column - Technicians List */}
        <div className="flex min-h-0 min-w-0 flex-col">
          <TechnicianList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
