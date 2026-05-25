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
