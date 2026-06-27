import { useServiceZonesQuery } from "../../../../entities/service-zone/useServiceZonesQuery";
import { useZoneNamesByTechnicianId } from "../../../../entities/technician-service-zone/useZoneNamesByTechnicianId";
import type { Technician } from "../../../../entities/technician/technician.types";
import { useUpdateTechnicianMutation } from "../../model/useUpdateTechnicianMutation";

interface ServiceZonesSectionProps {
  technician: Technician;
}

function ServiceZonesSection({ technician }: ServiceZonesSectionProps) {
  const {
    zoneNamesByTechnicianId,
    isPending: isZoneNamesPending,
    isError: isZoneNamesError,
    error: zoneNamesErrorObj,
  } = useZoneNamesByTechnicianId();
  const {
    data: zones,
    isPending: isZonesPending,
    isError: isZonesError,
    error: zonesErrorObject,
  } = useServiceZonesQuery();

  const updateTechnicianMutation = useUpdateTechnicianMutation();
  const isPending = updateTechnicianMutation.isPending;

  if (isZoneNamesPending || isZonesPending) {
    return <div>loading</div>;
  }
  if (isZoneNamesError || isZonesError) {
    return <div>{(zoneNamesErrorObj ?? zonesErrorObject)?.message}</div>;
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="flex items-center justify-center gap-2 flex-col">
        {zoneNamesByTechnicianId.get(technician.id)?.map((zoneName) => (
          <div
            key={zoneName}
            className="focus-visible:ring-main-500 cursor-pointer overflow-hidden rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:outline-none border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:hover:border-zinc-600 p-4 flex gap-4 justify-between items-center"
          >
            <span>{zoneName}</span>
            <button className="border border-red-200 p-2 rounded-xl">
              Delete
            </button>
          </div>
        ))}
      </div>

      <div>{zones.map((z) => z.name).join(" ")}</div>

      {/* Submit Button */}
      <div className="flex flex-col gap-2 items-center justify-center p-2">
        <button
          type="submit"
          disabled={isPending}
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

export default ServiceZonesSection;
