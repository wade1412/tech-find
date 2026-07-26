import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";

interface ManageBrandsSectionProps {
  brands: Brand[];
  brandGroups: BrandGroup[];
}

function ManageBrandsSection({
  brands,
  brandGroups,
}: ManageBrandsSectionProps) {
  return <div>ManageBrandsSection: {(brands.length, brandGroups.length)}</div>;
}

export default ManageBrandsSection;
