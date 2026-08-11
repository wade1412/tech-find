import { useState } from "react";
import { Dialog } from "@mui/material";
import type { User } from "../../../../entities/user/user.types";
import UserRoleBadge from "../../../../entities/user/ui/UserRoleBadge";
import { useUsersQuery } from "../../../../entities/user/useUsersQuery";
import {
  destructiveGhostButton,
  secondaryButton,
} from "../../../../shared/styles/styles";
import { useAuth } from "../../../auth/model/AuthContext";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { getUserEditCapabilities } from "../../model/editUser.helpers";
import {
  usePurgeUserMutation,
  useRestoreUserMutation,
} from "../model/useUserArchiveMutations";
import ConfirmPermanentUserPurgeDialog from "./ConfirmPermanentUserPurgeDialog";

interface ManageArchivedUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const archivedDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function ManageArchivedUsersDialog({
  isOpen,
  onClose,
}: ManageArchivedUsersDialogProps) {
  const { profile } = useAuth();
  const { canPurgeUsers, role } = useAuthPermissions();
  const [purgeTarget, setPurgeTarget] = useState<User | null>(null);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);
  const archivedQuery = useUsersQuery("archived", isOpen);
  const restoreMutation = useRestoreUserMutation();
  const purgeMutation = usePurgeUserMutation();
  const isMutating = restoreMutation.isPending || purgeMutation.isPending;

  const canRestoreUser = (user: User) =>
    getUserEditCapabilities({
      actorId: profile?.id,
      actorRole: role,
      target: user,
    }).canEditAccess;

  const purgeableUsers =
    archivedQuery.data?.filter((user) => canRestoreUser(user)) ?? [];

  const handleClose = () => {
    if (isMutating) return;
    restoreMutation.reset();
    purgeMutation.reset();
    setPurgeTarget(null);
    setIsDangerZoneOpen(false);
    onClose();
  };

  const handlePurgeConfirm = () => {
    if (!purgeTarget) return;

    purgeMutation.mutate(purgeTarget.id, {
      onSuccess: () => setPurgeTarget(null),
    });
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="user-archive-title"
        aria-describedby="user-archive-description"
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
              id="user-archive-title"
              className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Archived users
            </h2>
            <p
              id="user-archive-description"
              className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
            >
              Restore user access without losing profile details or role
              assignments.
            </p>
          </div>

          <div className="app-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {archivedQuery.isPending ? (
              <div className="flex flex-col gap-2" aria-label="Loading archive">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
                  />
                ))}
              </div>
            ) : archivedQuery.isError ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400"
              >
                Failed to load archived users.
              </p>
            ) : archivedQuery.data?.length ? (
              <ul className="flex flex-col gap-2.5">
                {archivedQuery.data.map((user) => {
                  const canRestore = canRestoreUser(user);

                  return (
                    <li
                      key={user.id}
                      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/50"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                            {user.alias}
                          </p>
                          <UserRoleBadge role={user.role} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {user.full_name} · {user.email}
                        </p>
                        {user.archived_at && (
                          <p className="mt-1 text-[0.6875rem] text-zinc-400 dark:text-zinc-500">
                            Archived{" "}
                            {archivedDateFormatter.format(
                              new Date(user.archived_at),
                            )}
                            {" · "}Restores as{" "}
                            {user.active_before_archive ? "active" : "inactive"}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center justify-end gap-2">
                        {!canRestore && (
                          <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                            View only
                          </span>
                        )}
                        {canRestore && (
                          <button
                            type="button"
                            className={secondaryButton}
                            disabled={isMutating}
                            onClick={() => {
                              restoreMutation.reset();
                              restoreMutation.mutate(user.id);
                            }}
                          >
                            {restoreMutation.isPending &&
                            restoreMutation.variables === user.id
                              ? "Restoring..."
                              : "Restore"}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-8 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  Archive is empty
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Archived users will appear here.
                </p>
              </div>
            )}

            {canPurgeUsers && purgeableUsers.length > 0 && (
              <details
                open={isDangerZoneOpen}
                onToggle={(event) =>
                  setIsDangerZoneOpen(event.currentTarget.open)
                }
                className="mt-5 rounded-xl border border-red-200 bg-red-50/40 dark:border-red-900/50 dark:bg-red-950/15"
              >
                <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-red-700 marker:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:text-red-300">
                  Danger zone
                </summary>
                <div className="border-t border-red-200 px-4 py-4 dark:border-red-900/50">
                  <p className="mb-3 text-xs leading-5 text-red-700/80 dark:text-red-300/80">
                    Permanent purge removes the Auth account and profile. It
                    cannot be undone.
                  </p>
                  <ul className="flex flex-col gap-2">
                    {purgeableUsers.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-red-200/70 bg-white/70 px-3 py-2 dark:border-red-900/40 dark:bg-zinc-950/30"
                      >
                        <span className="min-w-0 truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">
                          {user.alias}
                        </span>
                        <button
                          type="button"
                          className={destructiveGhostButton}
                          disabled={isMutating}
                          onClick={() => {
                            purgeMutation.reset();
                            setPurgeTarget(user);
                          }}
                        >
                          Purge permanently
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}

            {restoreMutation.isError && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
              >
                Failed to restore user. Please try again.
              </p>
            )}
          </div>

          <div className="flex justify-end border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <button
              type="button"
              className={secondaryButton}
              disabled={isMutating}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>

      <ConfirmPermanentUserPurgeDialog
        key={purgeTarget?.id ?? "closed"}
        user={purgeTarget}
        isPending={purgeMutation.isPending}
        error={purgeMutation.error}
        onClose={() => {
          if (purgeMutation.isPending) return;
          purgeMutation.reset();
          setPurgeTarget(null);
        }}
        onConfirm={handlePurgeConfirm}
      />
    </>
  );
}

export default ManageArchivedUsersDialog;
