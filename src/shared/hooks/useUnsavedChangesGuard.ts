import { useCallback, useRef, useState } from "react";
import { useBeforeUnload, useBlocker } from "react-router";

export const useUnsavedChangesGuard = (isDirty: boolean) => {
  // Ref for bypassing guard
  const bypassNextNavigationRef = useRef(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Block SPA page change on dirty form
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (bypassNextNavigationRef.current) return false;

    return (
      isDirty &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search ||
        currentLocation.hash !== nextLocation.hash)
    );
  });

  // Block URL page changes and page reloads
  useBeforeUnload(
    useCallback(
      (event: BeforeUnloadEvent) => {
        if (!isDirty) return;

        event.preventDefault();
      },
      [isDirty],
    ),
    { capture: true },
  );

  // Save pending actions on dirty form on react-router unrealted actions
  const requestAction = useCallback(
    (action: () => void) => {
      if (!isDirty) {
        action();
        return;
      }

      setPendingAction(() => action);
    },
    [isDirty],
  );

  // For navigation without guard after succesful entity creation
  const proceedWithoutPrompt = useCallback((action: () => void) => {
    bypassNextNavigationRef.current = true;
    action();

    bypassNextNavigationRef.current = true;

    // using async and microqueque to avoid racing condition issues, because react code is sync
    try {
      action();
    } finally {
      queueMicrotask(() => {
        bypassNextNavigationRef.current = false;
      });
    }
  }, []);

  const stay = useCallback(() => {
    setPendingAction(null);
    if (blocker.state === "blocked") blocker.reset();
  }, [blocker]);

  const leave = useCallback(() => {
    if (blocker.state === "blocked") {
      blocker.proceed();
      return;
    }

    const action = pendingAction;
    setPendingAction(null);
    action?.();
  }, [blocker, pendingAction]);

  return {
    isDialogOpen: blocker.state === "blocked" || pendingAction !== null,
    leave,
    proceedWithoutPrompt,
    requestAction,
    stay,
  };
};
