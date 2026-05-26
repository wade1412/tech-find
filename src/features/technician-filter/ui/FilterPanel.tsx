import SpecificIssueSelect from "../../../entities/specific-issue/ui/SpecificIssueSelect";
import { headingStyle } from "../../../shared/styles/styles";
import BrandSelect from "./BrandSelect";
import JobOptions from "./JobOptions";
import UnitSelector from "./UnitSelector";

function FilterPanel() {
  return (
    <div className="flex flex-col gap-5">
      {/* Brand Select */}
      <section>
        <h2 className={headingStyle}>Filter by Brand</h2>
        <BrandSelect />
      </section>

      <section>
        <h2 className={headingStyle}>Specific Issues</h2>
        <SpecificIssueSelect />
      </section>

      <JobOptions />

      {/* Unit List */}
      <section>
        <h2 className={headingStyle}>Units</h2>
        <UnitSelector />
      </section>
    </div>
  );
}

export default FilterPanel;
