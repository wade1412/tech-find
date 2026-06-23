import { useState } from "react";
import type { Technician } from "../../entities/technician/technician.types";
import ToggleStatus from "./ToggleStatus";

interface ProfileAndCapacitiesSectionProps {
  technician: Technician;
}

type ProfileFieldConfig = {
  key: keyof Technician;
  label: string;
};

const PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: "alias", label: "Alias" },
  { key: "name", label: "Technician Name" },
  { key: "active", label: "Status" },
  { key: "home_zip_code", label: "Home Zip Code" },
  { key: "jobs_per_day", label: "Jobs Per Day" },
  { key: "notes", label: "Notes" },
];
const CAPABILITY_FIELDS: ProfileFieldConfig[] = [
  { key: "gas", label: "Gas Capable" },
  { key: "commercial", label: "Commercial Capable" },
  { key: "can_service_built_in", label: "Built-In Capable (Lift)" },
  {
    key: "can_service_stacked_dryer",
    label: "Stacked Dryer Capable (Sliders)",
  },
  {
    key: "can_service_stacked_washer",
    label: "Stacked Washer Capable (Sliders)",
  },
];

const labelStyle = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

function ProfileAndCapacitiesSection({
  technician,
}: ProfileAndCapacitiesSectionProps) {
  const [isActive, setIsActive] = useState(technician.active);
  const [capabilities, setCapabilities] = useState(
    Object.fromEntries(
      CAPABILITY_FIELDS.map(({ key }) => [key, Boolean(technician[key])]),
    ),
  );

  const toggleCapability = (key: string) =>
    setCapabilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <form className="flex flex-col gap-6">
      {/* Technician Status */}
      <div
        className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
          isActive
            ? "border-zinc-200 bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50"
            : "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20"
        }`}
      >
        <div>
          <p className={labelStyle}>Technician status</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Inactive technicians are excluded from all matching
          </p>
        </div>
        <ToggleStatus checked={isActive} onChange={setIsActive} />
      </div>

      {/* Main Section*/}
      <div>
        {/* Edit Profile Info */}
        <div className="flex flex-col gap-2">
          {PROFILE_FIELDS.map(({ key, label }) => {
            if (key === "active") {
              return <ToggleStatus checked={isActive} onChange={setIsActive} />;
            }

            return (
              <div key={key} className="flex flex-col gap-1">
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  placeholder={
                    typeof technician[key] === "string"
                      ? technician[key]
                      : label
                  }
                />
              </div>
            );
          })}
        </div>

        {/* Edit Capabilites */}
        <div>
          {CAPABILITY_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <label htmlFor={key}>{label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-2">
        <button
          type="submit"
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default ProfileAndCapacitiesSection;
