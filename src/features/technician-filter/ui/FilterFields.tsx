import { headingStyleWithBottomMargin } from "../../../shared/styles/styles";
import BrandSelect from "./BrandSelect";
import JobUnitSection from "./JobUnitSection/JobUnitSection";
import SpecificIssueSelect from "./SpecificIssueSelect";
import ZoneSelect from "./ZoneSelect";

function FilterFields() {
  return (
    <>
      <section>
        <h3 className={headingStyleWithBottomMargin}>Filter by Zone</h3>
        <ZoneSelect />
      </section>

      <section>
        <h3 className={headingStyleWithBottomMargin}>Units</h3>
        <JobUnitSection />
      </section>

      <section>
        <h3 className={headingStyleWithBottomMargin}>Filter by Brand</h3>
        <BrandSelect />
      </section>

      <section>
        <h3 className={headingStyleWithBottomMargin}>Specific Issues</h3>
        <SpecificIssueSelect />
      </section>
    </>
  );
}

export default FilterFields;
