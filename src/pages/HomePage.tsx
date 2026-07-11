import type { CSSProperties } from "react";
import TechnicianList from "../entities/technician/ui/TechnicianList";
import FilterPanel from "../features/technician-filter/ui/FilterPanel";
import { useElementHeight } from "../shared/hooks/useElementHeight";

type FilterPanelHeightStyle = CSSProperties & {
  "--filter-panel-height"?: string;
};

export function HomePage() {
  const { ref: filterPanelRef, height: filterPanelHeight } =
    useElementHeight<HTMLDivElement>();
  const filterPanelHeightStyle: FilterPanelHeightStyle = {
    "--filter-panel-height": filterPanelHeight
      ? `${filterPanelHeight}px`
      : undefined,
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div
        className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"
        style={filterPanelHeightStyle}
      >
        {/* Left Column - filtering options: Units, Brands and others */}
        <div ref={filterPanelRef} className="min-w-0">
          <FilterPanel />
        </div>

        {/* Right Column - Technicians List */}
        <div className="min-w-0">
          <TechnicianList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
