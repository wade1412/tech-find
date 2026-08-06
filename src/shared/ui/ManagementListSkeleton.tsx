import {
  centeredContainerStyle,
  formStyle,
  manageListGridStyle,
} from "../styles/styles";
import HorizontalDivider from "./HorizontalDivider";

const pulse = "animate-pulse bg-zinc-200 dark:bg-zinc-800";

function ManagementListSkeleton() {
  return (
    <div
      className={centeredContainerStyle}
      role="status"
      aria-label="Loading management list"
      aria-busy="true"
    >
      <section className={formStyle} aria-hidden="true">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className={`${pulse} h-7 w-48 rounded-md`} />
            <div className={`${pulse} h-3.5 w-80 max-w-[75vw] rounded-md`} />
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className={`${pulse} h-10 w-full rounded-xl sm:w-40`} />
            <div className={`${pulse} h-10 w-full rounded-xl sm:w-40`} />
          </div>
        </div>

        <HorizontalDivider />

        <div className={`${formStyle} px-2`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={`${pulse} h-10 w-full rounded-xl sm:w-75`} />
            <div className={`${pulse} h-10 w-full rounded-xl sm:w-72`} />
          </div>

          <div className={`${pulse} h-3 w-20 rounded-md`} />

          <div className={manageListGridStyle}>
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex min-h-24 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className={`${pulse} h-8 w-8 shrink-0 rounded-full`} />
                <div className="min-w-0 flex-1 space-y-2">
                  <div
                    className={`${pulse} h-4 rounded-md ${
                      index % 2 === 0 ? "w-36" : "w-44"
                    } max-w-full`}
                  />
                  <div className={`${pulse} h-3 w-28 max-w-full rounded-md`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ManagementListSkeleton;
