import type { ReactNode } from "react";
import {
  destructiveGhostButton,
  secondaryButton,
} from "../../../../shared/styles/styles";

export interface ArchivedServiceEntity {
  active_before_archive: boolean | null;
  archived_at: string | null;
  id: string;
  name: string;
}

interface ArchivedEntityListCopy {
  emptyDescription: string;
  entityLabel: string;
  purgeDescription: string;
}

interface ArchivedEntityListState {
  canPurge: boolean;
  isBusy: boolean;
  restoreError: boolean;
  restoringId?: string;
}

interface ArchivedServiceEntityListProps<
  TEntity extends ArchivedServiceEntity,
> {
  copy: ArchivedEntityListCopy;
  items: TEntity[];
  onPurgeRequest: (entity: TEntity) => void;
  onRestore: (id: string) => void;
  renderDetails?: (entity: TEntity) => ReactNode;
  state: ArchivedEntityListState;
}

const archivedDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function ArchivedServiceEntityList<
  TEntity extends ArchivedServiceEntity,
>({
  copy,
  items,
  onPurgeRequest,
  onRestore,
  renderDetails,
  state,
}: ArchivedServiceEntityListProps<TEntity>) {
  return (
    <div>
      {items.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {items.map((entity) => (
            <li
              key={entity.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {entity.name}
                </p>
                {renderDetails?.(entity)}
                {entity.archived_at && (
                  <p className="mt-1 text-[0.6875rem] text-zinc-400 dark:text-zinc-500">
                    Archived {archivedDateFormatter.format(new Date(entity.archived_at))}
                    {" · "}Restores as{" "}
                    {entity.active_before_archive ? "active" : "inactive"}
                  </p>
                )}
              </div>

              <button
                type="button"
                className={secondaryButton}
                disabled={state.isBusy}
                aria-label={`Restore ${entity.name}`}
                onClick={() => onRestore(entity.id)}
              >
                {state.restoringId === entity.id ? "Restoring..." : "Restore"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-7 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            No archived {copy.entityLabel}s
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {copy.emptyDescription}
          </p>
        </div>
      )}

      {state.canPurge && items.length > 0 && (
        <details className="mt-4 rounded-xl border border-red-200 bg-red-50/40 dark:border-red-900/50 dark:bg-red-950/15">
          <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-red-700 marker:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:text-red-300">
            Danger zone
          </summary>
          <div className="border-t border-red-200 px-4 py-4 dark:border-red-900/50">
            <p className="mb-3 text-xs leading-5 text-red-700/80 dark:text-red-300/80">
              {copy.purgeDescription}
            </p>
            <ul className="flex flex-col gap-2">
              {items.map((entity) => (
                <li
                  key={entity.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-red-200/70 bg-white/70 px-3 py-2 dark:border-red-900/40 dark:bg-zinc-950/30"
                >
                  <span className="min-w-0 truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">
                    {entity.name}
                  </span>
                  <button
                    type="button"
                    className={destructiveGhostButton}
                    disabled={state.isBusy}
                    aria-label={`Purge ${entity.name} permanently`}
                    onClick={() => onPurgeRequest(entity)}
                  >
                    Purge permanently
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}

      {state.restoreError && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
        >
          Failed to restore {copy.entityLabel}. Please try again.
        </p>
      )}
    </div>
  );
}

export default ArchivedServiceEntityList;
