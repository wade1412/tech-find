import type { Technician } from "../../entities/technician/technician.types";
import ToggleStatus from "./ToggleStatus";

interface ProfileAndCapacitiesSectionProps {
  technician: Technician;
}

type ProfileFieldConfig = {
  key: keyof Technician;
  label: string;
};

const TECHNICIAN_PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: "alias", label: "Alias" },
  { key: "name", label: "Technician Name" },
  { key: "active", label: "Status" },
  { key: "home_zip_code", label: "Home Zip Code" },
  { key: "jobs_per_day", label: "Jobs Per Day" },
  { key: "notes", label: "Notes" },
];
const TECHNICIAN_CAPABILITIES_FIELDS: ProfileFieldConfig[] = [
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

function ProfileAndCapacitiesSection({
  technician,
}: ProfileAndCapacitiesSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Edit Profile
      </h2>

      {/* Main Section*/}
      <div>
        {/* Edit Profile Info */}
        <div className="flex flex-col gap-2">
          {TECHNICIAN_PROFILE_FIELDS.map(({ key, label }) => {
            if (key === "active") {
              return <ToggleStatus />;
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
          {TECHNICIAN_CAPABILITIES_FIELDS.map(({ key, label }) => (
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
    </div>
  );
}

export default ProfileAndCapacitiesSection;
