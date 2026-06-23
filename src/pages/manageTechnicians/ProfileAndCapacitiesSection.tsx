import { useState } from "react";
import type { Technician } from "../../entities/technician/technician.types";
import ToggleStatus from "./ToggleStatus";
import Checkbox from "../../shared/ui/Checkbox";

interface ProfileAndCapacitiesSectionProps {
  technician: Technician;
}

type ProfileFieldKey =
  | "alias"
  | "name"
  | "home_zip_code"
  | "jobs_per_day"
  | "notes";

type ProfileFieldConfig = {
  key: ProfileFieldKey;
  label: string;
};

type CapabilityFieldKey =
  | "gas"
  | "commercial"
  | "can_service_built_in"
  | "can_service_stacked_washer"
  | "can_service_stacked_dryer";

type CapabilityFieldConfig = {
  key: CapabilityFieldKey;
  label: string;
};

const PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: "alias", label: "Alias" },
  { key: "name", label: "Technician Name" },
  { key: "home_zip_code", label: "Home Zip Code" },
  { key: "jobs_per_day", label: "Jobs Per Day" },
  { key: "notes", label: "Notes" },
];
const CAPABILITY_FIELDS: CapabilityFieldConfig[] = [
  {
    key: "can_service_stacked_dryer",
    label: "Stacked Dryer (Sliders)",
  },
  { key: "gas", label: "Gas" },
  {
    key: "can_service_stacked_washer",
    label: "Stacked Washer (Sliders)",
  },
  { key: "commercial", label: "Commercial" },
  { key: "can_service_built_in", label: "Built-In (Lift)" },
];

const labelStyle = "text-sm font-medium text-zinc-400 dark:text-zinc-500";
const inputStyle =
  "rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 outline-none transition-[border,background-color,color] focus:border-main-500 focus:bg-white focus:ring-2 focus:ring-main-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-main-500 dark:focus:bg-zinc-950";

function ProfileAndCapacitiesSection({
  technician,
}: ProfileAndCapacitiesSectionProps) {
  const [isActive, setIsActive] = useState(technician.active);

  const initialProfile = Object.fromEntries(
    PROFILE_FIELDS.map(({ key }) => [key, String(technician[key] ?? "")]),
  );

  const initialCapabilities = Object.fromEntries(
    CAPABILITY_FIELDS.map(({ key }) => [key, Boolean(technician[key])]),
  );

  const [profile, setProfile] = useState(initialProfile);
  const [capabilities, setCapabilities] = useState(initialCapabilities);

  const onInputChange = (key: string, newValue: string) => {
    setProfile((prev) => ({ ...prev, [key]: newValue }));
  };

  const toggleCapability = (key: string) =>
    setCapabilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <form className="flex flex-col gap-6">
      {/* Head - Technician Status */}
      <div
        className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${isActive ? "border-zinc-200 bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50" : "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20"}`}
      >
        <div>
          <p className={labelStyle}>Technician status</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Inactive technicians are excluded from all matching
          </p>
        </div>
        <ToggleStatus checked={isActive} onChange={setIsActive} />
      </div>

      {/* Profile Fields */}
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Profile
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PROFILE_FIELDS.map(({ key, label }) =>
            key === "notes" ? (
              <div key={key}>
                <label className={`flex flex-col gap-1.5 ${labelStyle}`}>
                  Notes
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={profile[key]}
                    onChange={(e) => onInputChange(key, e.target.value)}
                    className={`${inputStyle} resize-none`}
                  />
                </label>
              </div>
            ) : (
              <div key={key}>
                <label
                  key={key}
                  className={`flex flex-col gap-1.5 ${labelStyle}`}
                >
                  {label}
                  <input
                    id={key}
                    name={key}
                    value={profile[key]}
                    onChange={(e) => onInputChange(key, e.target.value)}
                    className={inputStyle}
                  />
                </label>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Capabilites */}
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Capabilities
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CAPABILITY_FIELDS.map(({ key, label }) => (
            <Checkbox
              key={key}
              id={key}
              label={label}
              checked={capabilities[key]}
              onChange={() => toggleCapability(key)}
            />
          ))}
        </div>
      </section>

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
