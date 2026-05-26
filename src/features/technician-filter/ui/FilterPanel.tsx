import SpecificIssueSelect from "./SpecificIssueSelect";
import { headingStyle } from "../../../shared/styles/styles";
import BrandSelect from "./BrandSelect";
import JobOptions from "./JobOptions";
import UnitSelector from "./UnitSelector";
import { useTechnicianFilters } from "../model/useTechnicianFilters";

function FilterPanel() {
  const { filter, resetFilters } = useTechnicianFilters();

  const hasAnyFilter =
    filter.unitSlugs.length > 0 ||
    filter.brandSlugs.length > 0 ||
    filter.specificIssueSlugs.length > 0 ||
    filter.isGas ||
    filter.isStacked ||
    filter.isCommercial;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="">Filters</h2>

        <button
          disabled={!hasAnyFilter}
          onClick={resetFilters}
          className="text-sm text-main-500 transition-color hover:text-main-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-main-500"
        >
          Reset
        </button>
      </div>

      <section>
        <h2 className={headingStyle}>Filter by Brand</h2>
        <BrandSelect />
      </section>

      <section>
        <h2 className={headingStyle}>Specific Issues</h2>
        <SpecificIssueSelect />
      </section>

      <section>
        <h2 className={headingStyle}>Units</h2>
        <JobOptions />
        <UnitSelector />
      </section>
    </div>
  );
}

export default FilterPanel;
