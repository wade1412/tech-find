import type { CSSProperties } from "react";
import TechnicianList from "../entities/technician/ui/TechnicianList";
import FilterPanel from "../features/technician-filter/ui/FilterPanel";
import { useAvailableViewportHeight } from "../shared/hooks/useAvailableViewportHeight";
import { centeredContainerStyle } from "../shared/styles/styles";

type TechnicianListHeightStyle = CSSProperties & {
  "--technician-list-height"?: string;
};

export function HomePage() {
  const { ref: technicianColumnRef, height: availableViewportHeight } =
    useAvailableViewportHeight<HTMLDivElement>({
      reservedBottomSelector: "[data-app-footer]",
      containerSelector: "[data-home-page]",
    });
  const technicianListHeightStyle: TechnicianListHeightStyle = {
    "--technician-list-height":
      availableViewportHeight !== null
        ? `${availableViewportHeight}px`
        : undefined,
  };

  return (
    <div data-home-page className={centeredContainerStyle}>
      <div
        className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"
        style={technicianListHeightStyle}
      >
        {/* Left Column - filtering options: Units, Brands and others */}
        <div className="min-w-0">
          <FilterPanel />
        </div>

        {/* Right Column - Technicians List */}
        <div ref={technicianColumnRef} className="min-w-0">
          <TechnicianList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
