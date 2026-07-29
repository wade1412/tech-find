import { AnimatePresence, motion } from "motion/react";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import {
  managementListItemVariants,
  managementListVariants,
} from "../../../../shared/styles/motionVariants";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import ManageBrandCard from "./ManageBrandCard";
import {
  brandsListStyle,
  ghostButton,
  noEditValuesStyle,
} from "../../../../shared/styles/styles";

interface BrandsListProps {
  brands: Brand[];
  brandGroupById: ReadonlyMap<string, BrandGroup>;
  hasAppliedFilters: boolean;
  onFiltersClear: () => void;
}

function BrandsList({
  brands,
  brandGroupById,
  hasAppliedFilters,
  onFiltersClear,
}: BrandsListProps) {
  return (
    <div className={brandsListStyle}>
      <SectionHeader
        label="Brands"
        subtext={`${brands.length} ${brands.length === 1 ? "brand" : "brands"}`}
      />

      <motion.div
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-3"
        variants={managementListVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <motion.div
                key={brand.id}
                layout
                variants={managementListItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileTap={{ scale: 0.98 }}
              >
                <ManageBrandCard
                  brand={brand}
                  brandGroup={brandGroupById.get(brand.group_id)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              layout
              variants={managementListItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${noEditValuesStyle} col-span-full flex flex-col items-center gap-2`}
            >
              <p>
                {hasAppliedFilters
                  ? "No brands match the current filters."
                  : "No brands have been created yet."}
              </p>
              {hasAppliedFilters && (
                <button
                  type="button"
                  className={ghostButton}
                  onClick={onFiltersClear}
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default BrandsList;
