import SpecificIssueSelect from "./SpecificIssueSelect";
import { headingStyle } from "../../../shared/styles/styles";
import BrandSelect from "./BrandSelect";
import JobOptions from "./JobOptions";
import UnitSelector from "./UnitSelector";
import { useTechnicianFilters } from "../model/useTechnicianFilters";
import ZoneSelect from "./ZoneSelect";

function FilterPanel() {
  const { filter, resetFilters } = useTechnicianFilters();

  const hasAnyFilter =
    filter.zone ||
    filter.unitSlugs.length > 0 ||
    filter.brandSlugs.length > 0 ||
    filter.specificIssueSlugs.length > 0 ||
    filter.isGas ||
    filter.isStacked ||
    filter.isCommercial;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Filters
        </h2>

        <button
          disabled={!hasAnyFilter}
          onClick={resetFilters}
          className="text-sm text-main-500 transition-colors hover:text-main-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-main-500"
        >
          Reset
        </button>
      </div>

      <main className="flex flex-col gap-2.5">
        <section>
          <h2 className={headingStyle}>Filter by Zone</h2>
          <ZoneSelect />
        </section>

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
      </main>
    </div>
  );
}

export default FilterPanel;
