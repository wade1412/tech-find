import { useMemo, useState } from "react";
import type { Technician } from "../../../entities/technician/technician.types";
import ToggleStatus from "../ToggleStatus";
import Checkbox from "../../../shared/ui/Checkbox";
import { CAPABILITY_FIELDS, PROFILE_FIELDS } from "./profile.constants";
import {
  buildTechnicianPatch,
  createTechnicianFormState,
} from "./profile.helpers";
import { type CapabilityFieldKey, type ProfileFieldKey } from "./profile.types";
import { useUpdateTechnicianMutation } from "../../../features/technician-management/model/useUpdateTechnicianMutation";
interface ProfileAndCapacitiesSectionProps {
  technician: Technician;
}
const labelStyle = "text-sm font-medium text-zinc-400 dark:text-zinc-500";
const inputStyle =
  "rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 outline-none transition-[border,background-color,color] focus:border-main-500 focus:bg-white focus:ring-2 focus:ring-main-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-main-500 dark:focus:bg-zinc-950";

function ProfileAndCapacitiesSection({
  technician,
}: ProfileAndCapacitiesSectionProps) {
  const updateTechnicianMutation = useUpdateTechnicianMutation();

  const technicianFormState = createTechnicianFormState(technician);
  const [formState, setFormState] = useState(technicianFormState);

  const toggleActive = () =>
    setFormState((prev) => ({ ...prev, active: prev.active ? false : true }));

  const patch = useMemo(
    () => buildTechnicianPatch(technician, formState),
    [technician, formState],
  );

  const isDirty = Object.keys(patch).length > 0;
  const isPending = updateTechnicianMutation.isPending;

  const onProfileFieldChange = (key: ProfileFieldKey, newValue: string) => {
    setFormState((prev) => ({ ...prev, [key]: newValue }));
  };

  const toggleCapability = (key: CapabilityFieldKey) =>
    setFormState((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return;

    updateTechnicianMutation.mutate({
      id: technician.id,
      patch,
    });
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Head - Technician Status */}
      <div
        className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${formState.active ? "border-zinc-200 bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50" : "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20"}`}
      >
        <div>
          <p className={labelStyle}>Technician status</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Inactive technicians are excluded from all matching
          </p>
        </div>
        <ToggleStatus
          checked={formState.active}
          onChange={toggleActive}
          disabled={isPending}
        />
      </div>

      <fieldset disabled={isPending} className="flex flex-col gap-6">
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
                      value={formState[key] ?? ""}
                      onChange={(e) =>
                        onProfileFieldChange(key, e.target.value)
                      }
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
                      value={formState[key]}
                      onChange={(e) =>
                        onProfileFieldChange(key, e.target.value)
                      }
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
                checked={formState[key]}
                onChange={() => toggleCapability(key)}
              />
            ))}
          </div>
        </section>
      </fieldset>

      {/* Submit Button */}
      <div className="flex flex-col gap-2 items-center justify-center p-2">
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {updateTechnicianMutation.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            Failed to save changes. Try again
          </p>
        )}
      </div>
    </form>
  );
}

export default ProfileAndCapacitiesSection;
