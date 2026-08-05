import TechnicianList from "../entities/technician/ui/TechnicianList";
import FilterPanel from "../features/technician-filter/ui/FilterPanel";
import { centeredContainerStyle } from "../shared/styles/styles";

export function HomePage() {
  return (
    <div
      data-home-page
      className={`${centeredContainerStyle} flex min-h-0 flex-1 flex-col`}
    >
      <div className="grid flex-1 grid-cols-1 items-start gap-6 md:min-h-0 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:items-stretch md:overflow-hidden">
        {/* Left Column - filtering options: Units, Brands and others */}
        <div className="app-scroll min-w-0 md:min-h-0 md:overflow-y-auto md:overscroll-contain md:pr-2">
          <FilterPanel />
        </div>

        {/* Right Column - Technicians List */}
        <div className="h-128 min-w-0 md:h-auto md:min-h-0">
          <TechnicianList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
