import { useSearchParams } from "react-router";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import {
  buttonContainerStyle,
  formWithPaddingStyle,
  pageTitleWithButtonsContainerStyle,
  searchRowStyle,
} from "../../../../shared/styles/styles";
import CreateNewEntityLinkButton from "../../../../shared/ui/CreateNewEntityLinkButton";
import HorizontalDivider from "../../../../shared/ui/HorizontalDivider";
import SearchInput from "../../../../shared/ui/SearchInput";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import SegmentedControl from "../../../../shared/ui/SegmentedControl";
import {
  isServiceStatusFilterValue,
  SERVICE_STATUS_FILTER_OPTIONS,
  type ServiceStatusFilterValue,
} from "../../model/servicesListFilters.constants";
import { useMemo } from "react";
import BrandGroupsList from "./BrandGroupsList";
import BrandsList from "./BrandsList";
import { filterBrandGroups, filterBrands } from "../model/filterBrandEntities";

interface ManageBrandsSectionProps {
  brands: Brand[];
  brandGroups: BrandGroup[];
}

function ManageBrandsSection({
  brands,
  brandGroups,
}: ManageBrandsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") ?? "";
  const filterParam = searchParams.get("filter");
  const statusFilter = isServiceStatusFilterValue(filterParam)
    ? filterParam
    : "all";

  const hasAppliedFilters =
    Boolean(searchTerm.trim()) || statusFilter !== "all";
  const brandGroupsById = useMemo(
    () => new Map(brandGroups?.map((b) => [b.id, b]) ?? []),
    [brandGroups],
  );
  const handleSearchChange = (value: string) => {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);

        if (value) {
          nextParams.set("query", value);
        } else {
          nextParams.delete("query");
        }

        return nextParams;
      },
      { replace: true },
    );
  };

  const handleStatusFilterChange = (value: ServiceStatusFilterValue) => {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);

        if (value === "all") {
          nextParams.delete("filter");
        } else {
          nextParams.set("filter", value);
        }

        return nextParams;
      },
      { replace: true },
    );
  };

  const clearFilters = () => {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);
        nextParams.delete("query");
        nextParams.delete("filter");
        return nextParams;
      },
      { replace: true },
    );
  };

  const visibleBrands = useMemo(
    () =>
      filterBrands({
        brands,
        brandGroupsById,
        searchTerm,
        status: statusFilter,
      }),
    [brands, brandGroupsById, searchTerm, statusFilter],
  );
  const visibleBrandGroups = useMemo(
    () => filterBrandGroups({ brandGroups, searchTerm, status: statusFilter }),
    [brandGroups, searchTerm, statusFilter],
  );
  const visibleBrandCountByGroupId = useMemo(() => {
    const counts = new Map<string, number>();

    visibleBrands.forEach((brand) => {
      counts.set(brand.group_id, (counts.get(brand.group_id) ?? 0) + 1);
    });

    return counts;
  }, [visibleBrands]);

  return (
    <div className={formWithPaddingStyle}>
      <div className={pageTitleWithButtonsContainerStyle}>
        <SectionHeader
          label="Manage Brands"
          subtext="Edit brand groups and brands"
        />

        <div className={buttonContainerStyle}>
          <CreateNewEntityLinkButton
            linkTo="brand-groups/new"
            label="Create Group"
          />
          <CreateNewEntityLinkButton linkTo="brands/new" label="Create Brand" />
        </div>
      </div>

      <HorizontalDivider />

      <div className={formWithPaddingStyle}>
        <div className={searchRowStyle}>
          <div className="w-full sm:w-auto sm:min-w-75">
            <SegmentedControl
              ariaLabel="Filter brands by status"
              options={SERVICE_STATUS_FILTER_OPTIONS}
              onChange={handleStatusFilterChange}
              value={statusFilter}
            />
          </div>

          <SearchInput
            placeholder="Search by name, slug, order, or group..."
            ariaLabel="Search brands"
            className="w-full sm:w-80"
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(15rem,0.85fr)_auto_minmax(0,2.15fr)]">
          <section className="min-w-0 rounded-2xl">
            <BrandGroupsList
              brandGroups={visibleBrandGroups}
              brandCountByGroupId={visibleBrandCountByGroupId}
              hasAppliedFilters={hasAppliedFilters}
              onFiltersClear={clearFilters}
            />
          </section>

          {/* Divider */}
          <div
            aria-hidden="true"
            className="h-px w-full bg-zinc-200 lg:h-auto lg:w-px lg:self-stretch dark:bg-zinc-800"
          />

          <section className="min-w-0 rounded-2xl">
            <BrandsList
              brands={visibleBrands}
              brandGroupsById={brandGroupsById}
              hasAppliedFilters={hasAppliedFilters}
              onFiltersClear={clearFilters}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default ManageBrandsSection;
