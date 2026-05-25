import { headingStyle } from "../../../shared/styles/styles";
import BrandSelect from "./BrandSelect";
import UnitSelector from "./UnitSelector";

function FilterPanel() {
  return (
    <div>
      {/* Brand Select */}
      <section>
        <h2 className={headingStyle}>Filter by Brand</h2>
        <BrandSelect />
      </section>

      {/* Unit List */}
      <section>
        <h2 className={headingStyle}>Units</h2>
        <UnitSelector />
      </section>
    </div>
  );
}

export default FilterPanel;
