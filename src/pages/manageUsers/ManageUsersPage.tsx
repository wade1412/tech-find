import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useSearchParams } from "react-router";
import { useUsersQuery } from "../../entities/user/useUsersQuery";
import {
  isUserStatusFilterValue,
  USER_STATUS_FILTER_OPTIONS,
  type UserStatusFilterValue,
} from "../../features/user-management/model/userListFilters.constants";
import { filterUsers } from "../../features/user-management/model/filterUsers";
import ManageUserCard from "../../features/user-management/ui/ManageUserCard";
import {
  managementListItemVariants,
  managementListVariants,
} from "../../shared/styles/motionVariants";
import {
  buttonContainerStyle,
  centeredContainerStyle,
  createManagementItemButtonStyle,
  formStyle,
  ghostButton,
  manageListGridStyle,
  noEditValuesStyle,
  pageTitleWithButtonsContainerStyle,
  sectionHeaderSubtextStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import ManagementListSkeleton from "../../shared/ui/ManagementListSkeleton";
import PageHeader from "../../shared/ui/PageHeader";
import SearchInput from "../../shared/ui/SearchInput";
import SegmentedControl from "../../shared/ui/SegmentedControl";
import { useAuthPermissions } from "../../features/auth/model/useAuthPermissions";
import {
  getUsersVisibleToRole,
  putCurrentUserFirst,
} from "../../features/user-management/model/userVisibility";
import { useAuth } from "../../features/auth/model/AuthContext";
import { getUserEditCapabilities } from "../../features/user-management/model/editUser.helpers";
import OpenArchivedUsersDialogButton from "../../features/user-management/archive-user/ui/OpenArchivedUsersDialogButton";

function formatUserCount(count: number) {
  return `${count} ${count === 1 ? "user" : "users"}`;
}

function ManageUsersPage() {
  const { data: users, isPending, isError, error } = useUsersQuery();
  const { profile } = useAuth();
  const { role } = useAuthPermissions();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterParam = searchParams.get("filter");
  const statusFilter = isUserStatusFilterValue(filterParam)
    ? filterParam
    : "all";
  const searchTerm = searchParams.get("query") || "";

  const handleInputChange = (value: string) => {
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

  const handleStatusFilterChange = (value: UserStatusFilterValue) => {
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

  const accessibleUsers = useMemo(
    () => getUsersVisibleToRole(users ?? [], role),
    [users, role],
  );
  const visibleUsers = useMemo(() => {
    const filteredUsers = filterUsers({
      users: accessibleUsers,
      searchTerm,
      status: statusFilter,
    });

    return putCurrentUserFirst(filteredUsers, profile?.id);
  }, [accessibleUsers, profile?.id, searchTerm, statusFilter]);

  const hasAppliedFilters =
    Boolean(searchTerm.trim()) || statusFilter !== "all";
  const usersCount = accessibleUsers.length;
  const resultCountLabel = hasAppliedFilters
    ? `${visibleUsers.length} of ${formatUserCount(usersCount)}`
    : formatUserCount(usersCount);

  if (isPending) {
    return <ManagementListSkeleton />;
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
            subtitle="View user accounts and manage profiles within your access level"
          />

          <div className={buttonContainerStyle}>
            <OpenArchivedUsersDialogButton />
            <Link to="new" className={createManagementItemButtonStyle}>
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Create User</span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
        />

        <div className={`${formStyle} px-2`}>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-auto sm:min-w-75">
              <SegmentedControl
                ariaLabel="Filter users by status"
                options={USER_STATUS_FILTER_OPTIONS}
                onChange={handleStatusFilterChange}
                value={statusFilter}
              />
            </div>

            <SearchInput
              placeholder="Search by name, email, or role..."
              ariaLabel="Search users"
              className="w-full sm:w-72"
              value={searchTerm}
              onValueChange={handleInputChange}
            />
          </div>

          <div>
            <p
              aria-live="polite"
              className={`${sectionHeaderSubtextStyle} mb-2.5`}
            >
              {resultCountLabel}
            </p>

            <motion.div
              className={manageListGridStyle}
              variants={managementListVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {visibleUsers.length > 0 ? (
                  visibleUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      layout
                      variants={managementListItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileTap={{ scale: 0.98 }}
                    >
                      <ManageUserCard
                        user={user}
                        isCurrentUser={user.id === profile?.id}
                        isViewOnly={
                          !getUserEditCapabilities({
                            actorId: profile?.id,
                            actorRole: role,
                            target: user,
                          }).canEditProfile
                        }
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
                        ? "No users match the current filters."
                        : "No users have been created yet."}
                    </p>
                    {hasAppliedFilters && (
                      <button
                        type="button"
                        className={ghostButton}
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ManageUsersPage;
