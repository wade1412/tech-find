import { useSearchParams } from "react-router";
import {
  buttonContainerStyle,
  centeredContainerStyle,
  formStyle,
  manageListGridStyle,
  pageTitleWithButtonsContainerStyle,
  secondaryButton,
  sectionHeaderSubtextStyle,
} from "../shared/styles/styles";
import PageHeader from "../shared/ui/PageHeader";
import SearchInput from "../shared/ui/SearchInput";
import { AnimatePresence, motion } from "motion/react";
import { technicianListVariants } from "../shared/styles/motionVariants";
import { useUsersQuery } from "../entities/user/useUsersQuery";
import ManageTechniciansListSkeleton from "../features/technician-management/ui/ManageTechniciansListSkeleton";
import ErrorMessage from "../shared/ui/ErrorMessage";
import {
  isManageUsersListFilterValue,
  MANAGE_USERS_LIST_FILTER_OPTIONS,
  type ManageUsersListFilterValue,
} from "../features/user-management/model/manageUsers.constants";
import SegmentedControl from "../shared/ui/SegmentedControl";
import { useMemo } from "react";
import { filterUsers } from "../features/user-management/model/filterUsers";
function ManageUsersPage() {
  const { data: users, isPending, isError, error } = useUsersQuery();

  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const statusFilter = isManageUsersListFilterValue(filterParam)
    ? filterParam
    : "all";

  const searchTerm = searchParams.get("query") || "";

  const handleInputChange = (value: string) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);

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

  const handleStatusFilterChange = (value: ManageUsersListFilterValue) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);

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

  const visibleUsers = useMemo(
    () => filterUsers({ users: users ?? [], searchTerm, status: statusFilter }),
    [users, searchTerm, statusFilter],
  );

  const hasAppliedFilters =
    Boolean(searchTerm.trim()) || statusFilter !== "all";
  const usersCount = users?.length ?? 0;

  if (isPending) {
    return <ManageTechniciansListSkeleton />;
  }

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error?.message} />
      </div>
    );
  }

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={pageTitleWithButtonsContainerStyle}>
          <PageHeader
            title="Manage Users"
            subtitle="Select a user to edit the data and role"
          />

          <div className={buttonContainerStyle}>
            <button className={secondaryButton}>Archived users</button>
            <button className={secondaryButton}>Create User</button>
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
        />

        {/* List Filter and Search */}
        <div className={`${formStyle} px-2`}>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-auto sm:min-w-75">
              <SegmentedControl
                ariaLabel="Select users filter"
                options={MANAGE_USERS_LIST_FILTER_OPTIONS}
                onChange={handleStatusFilterChange}
                value={statusFilter}
              />
            </div>

            <SearchInput
              placeholder="Search by name, ZIP, or zone..."
              ariaLabel="Search technicians"
              className="w-full sm:w-72"
              value={searchTerm}
              onValueChange={handleInputChange}
            />
          </div>

          {/* Users List */}
          <div>
            <div
              aria-live="polite"
              className={`${sectionHeaderSubtextStyle} mb-2.5`}
            >
              {hasAppliedFilters
                ? `${visibleUsers.length} of ${usersCount} users`
                : `${usersCount} users`}
            </div>
            <motion.div
              className={manageListGridStyle}
              variants={technicianListVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <AnimatePresence mode="popLayout">Users List</AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ManageUsersPage;
