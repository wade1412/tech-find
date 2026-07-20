import { useSearchParams } from "react-router";
import {
  buttonContainerStyle,
  centeredContainerStyle,
  formStyle,
  manageListGridStyle,
  pageTitleWithButtonsContainerStyle,
  secondaryButton,
} from "../shared/styles/styles";
import PageHeader from "../shared/ui/PageHeader";
import SearchInput from "../shared/ui/SearchInput";
import { AnimatePresence, motion } from "motion/react";
import { technicianListVariants } from "../shared/styles/motionVariants";

function ManageUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

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

        <div className={`${formStyle} px-2`}>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-auto sm:min-w-75">Control</div>

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
