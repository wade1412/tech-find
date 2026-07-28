import type { ReactNode } from "react";
import { Dialog } from "@mui/material";
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

interface ManageArchivedServiceEntitiesDialogProps<
  TEntity extends ArchivedServiceEntity,
> {
  archiveDescription: string;
  canPurge: boolean;
  entityLabel: string;
  entityPluralLabel: string;
  isError: boolean;
  isLoading: boolean;
  isMutating: boolean;
  isOpen: boolean;
  items: TEntity[];
  onClose: () => void;
  onPurgeRequest: (entity: TEntity) => void;
  onRestore: (id: string) => void;
  purgeDescription: string;
  renderDetails?: (entity: TEntity) => ReactNode;
  restoreError: boolean;
  restoringId?: string;
}

const archivedDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function ManageArchivedServiceEntitiesDialog<
  TEntity extends ArchivedServiceEntity,
>({
  archiveDescription,
  canPurge,
  entityLabel,
  entityPluralLabel,
  isError,
  isLoading,
  isMutating,
  isOpen,
  items,
  onClose,
  onPurgeRequest,
  onRestore,
  purgeDescription,
  renderDetails,
  restoreError,
  restoringId,
}: ManageArchivedServiceEntitiesDialogProps<TEntity>) {
  const titleId = `${entityLabel}-archive-title`;
  const descriptionId = `${entityLabel}-archive-description`;

  return (
    <Dialog
      open={isOpen}
      onClose={isMutating ? undefined : onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxWidth: "44rem",
            maxHeight: "min(42rem, calc(100vh - 2rem))",
            margin: 2,
            borderRadius: "0.75rem",
            border: 1,
            borderColor: "divider",
          },
        },
      }}
    >
      <div className="flex min-h-0 flex-col">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2
            id={titleId}
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Archived {entityPluralLabel}
          </h2>
          <p
            id={descriptionId}
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            {archiveDescription}
          </p>
        </div>

        <div className="app-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex flex-col gap-2" aria-label="Loading archive">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
                />
              ))}
            </div>
          ) : isError ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400"
            >
              Failed to load archived {entityPluralLabel}.
            </p>
          ) : items.length > 0 ? (
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
                        Archived{" "}
                        {archivedDateFormatter.format(
                          new Date(entity.archived_at),
                        )}
                        {" · "}Restores as{" "}
                        {entity.active_before_archive
                          ? "active"
                          : "inactive"}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className={secondaryButton}
                    disabled={isMutating}
                    onClick={() => onRestore(entity.id)}
                  >
                    {restoringId === entity.id ? "Restoring..." : "Restore"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-8 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Archive is empty
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Archived {entityPluralLabel} will appear here.
              </p>
            </div>
          )}

          {canPurge && items.length > 0 && (
            <details className="mt-5 rounded-xl border border-red-200 bg-red-50/40 dark:border-red-900/50 dark:bg-red-950/15">
              <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-red-700 marker:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:text-red-300">
                Danger zone
              </summary>
              <div className="border-t border-red-200 px-4 py-4 dark:border-red-900/50">
                <p className="mb-3 text-xs leading-5 text-red-700/80 dark:text-red-300/80">
                  {purgeDescription}
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
                        disabled={isMutating}
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

          {restoreError && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
            >
              Failed to restore {entityLabel}. Please try again.
            </p>
          )}
        </div>

        <div className="flex justify-end border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <button
            type="button"
            className={secondaryButton}
            disabled={isMutating}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ManageArchivedServiceEntitiesDialog;
