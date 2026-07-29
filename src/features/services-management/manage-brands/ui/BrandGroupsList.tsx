import { AnimatePresence, motion } from "motion/react";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import {
  brandsListStyle,
  ghostButton,
  noEditValuesStyle,
} from "../../../../shared/styles/styles";
import {
  managementListItemVariants,
  managementListVariants,
} from "../../../../shared/styles/motionVariants";
import ManageBrandGroupCard from "./ManageBrandGroupCard";

interface BrandGroupsListProps {
  brandGroups: BrandGroup[];
  brandCountByGroupId: ReadonlyMap<string, number>;
  hasAppliedFilters: boolean;
  onFiltersClear: () => void;
}

function BrandGroupsList({
  brandGroups,
  brandCountByGroupId,
  hasAppliedFilters,
  onFiltersClear,
}: BrandGroupsListProps) {
  return (
    <div className={brandsListStyle}>
      <SectionHeader
        label="Brand Groups"
        subtext={`${brandGroups.length} ${brandGroups.length === 1 ? "group" : "groups"}`}
      />

      <motion.div
        className={`${brandsListStyle} sm:grid sm:grid-cols-2 lg:flex`}
        variants={managementListVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {brandGroups.length > 0 ? (
            brandGroups.map((group) => (
              <motion.div
                key={group.id}
                layout
                variants={managementListItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileTap={{ scale: 0.98 }}
              >
                <ManageBrandGroupCard
                  brandGroup={group}
                  brandCount={brandCountByGroupId.get(group.id) ?? 0}
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
                  ? "No brand groups match the current filters."
                  : "No brand groups have been created yet."}
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

export default BrandGroupsList;
