import {
  cleanup,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  Link,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import UnsavedChangesDialog from "../ui/UnsavedChangesDialog";
import { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";

function GuardHarness({ isDirty = true }: { isDirty?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const guard = useUnsavedChangesGuard(isDirty);

  return (
    <>
      <span data-testid="location">{location.pathname}</span>
      <Link to="/next">Navigate</Link>
      <button
        type="button"
        onClick={() => guard.proceedWithoutPrompt(() => navigate("/next"))}
      >
        Saved navigation
      </button>
      <button
        type="button"
        onClick={() =>
          guard.requestAction(() => {
            document.body.dataset.section = "next";
          })
        }
      >
        Change section
      </button>

      <UnsavedChangesDialog
        isOpen={guard.isDialogOpen}
        onLeave={guard.leave}
        onStay={guard.stay}
      />
    </>
  );
}

const renderGuard = (isDirty = true) => {
  const router = createMemoryRouter(
    [
      { path: "/", element: <GuardHarness isDirty={isDirty} /> },
      { path: "/next", element: <p>Next page</p> },
    ],
    { initialEntries: ["/"] },
  );

  render(<RouterProvider router={router} />);
  return router;
};

afterEach(() => {
  cleanup();
  delete document.body.dataset.section;
});

describe("useUnsavedChangesGuard", () => {
  it("blocks router navigation until the user confirms", async () => {
    const user = userEvent.setup();
    renderGuard();

    await user.click(screen.getByRole("link", { name: "Navigate" }));

    expect(screen.getByTestId("location").textContent).toBe("/");
    expect(
      screen.getByRole("heading", { name: "Leave without saving?" }),
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Stay on page" }));
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));

    await user.click(screen.getByRole("link", { name: "Navigate" }));
    await user.click(
      screen.getByRole("button", { name: "Leave without saving" }),
    );

    expect(await screen.findByText("Next page")).toBeTruthy();
  });

  it("protects local section changes and supports an explicit save bypass", async () => {
    const user = userEvent.setup();
    const router = renderGuard();

    await user.click(screen.getByRole("button", { name: "Change section" }));
    expect(document.body.dataset.section).toBeUndefined();

    await user.click(
      screen.getByRole("button", { name: "Leave without saving" }),
    );
    expect(document.body.dataset.section).toBe("next");
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));

    await user.click(
      screen.getByRole("button", { name: "Saved navigation" }),
    );
    expect(router.state.location.pathname).toBe("/next");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("prevents page unload only while dirty", () => {
    const router = createMemoryRouter([
      { path: "/", element: <GuardHarness /> },
    ]);
    const { unmount } = render(<RouterProvider router={router} />);
    const dirtyEvent = new Event("beforeunload", { cancelable: true });

    window.dispatchEvent(dirtyEvent);
    expect(dirtyEvent.defaultPrevented).toBe(true);

    unmount();
    renderGuard(false);
    const cleanEvent = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(cleanEvent);
    expect(cleanEvent.defaultPrevented).toBe(false);
  });
});
