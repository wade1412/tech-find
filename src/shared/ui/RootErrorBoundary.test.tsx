import { useEffect, useState, type ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
} from "react-router";
import { RootErrorBoundary } from "./RootErrorBoundary";

function ThrowError({ message }: { message: string }): ReactNode {
  throw new Error(message);
}

describe("RootErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders children while there is no error", () => {
    render(
      <RootErrorBoundary>
        <p>Application content</p>
      </RootErrorBoundary>,
    );

    expect(screen.getByText("Application content")).not.toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows recovery UI when a child throws", () => {
    render(
      <RootErrorBoundary>
        <ThrowError message="Unexpected render failure" />
      </RootErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Reload application" }),
    ).not.toBeNull();
  });

  it("does not expose the raw error message or stack", () => {
    const sensitiveMessage = "Authorization token abc-secret leaked";

    render(
      <RootErrorBoundary>
        <ThrowError message={sensitiveMessage} />
      </RootErrorBoundary>,
    );

    expect(screen.queryByText(sensitiveMessage)).toBeNull();
    expect(document.body.textContent).not.toContain("abc-secret");
    expect(document.body.textContent).not.toContain("ThrowError");
  });

  it("shows deployment-specific copy for chunk errors", () => {
    render(
      <RootErrorBoundary>
        <ThrowError message="Failed to fetch dynamically imported module" />
      </RootErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", {
        name: "TechFind was updated while this tab was open",
      }),
    ).not.toBeNull();
    expect(screen.getByText(/download the latest version/i)).not.toBeNull();
  });

  it("remounts the subtree when Try again is clicked", async () => {
    const user = userEvent.setup();
    const onMount = vi.fn();

    function RecoverableChild() {
      const [shouldCrash, setShouldCrash] = useState(false);

      useEffect(() => {
        onMount();
      }, []);

      if (shouldCrash) {
        throw new Error("Temporary render failure");
      }

      return (
        <button type="button" onClick={() => setShouldCrash(true)}>
          Trigger error
        </button>
      );
    }

    render(
      <RootErrorBoundary>
        <RecoverableChild />
      </RootErrorBoundary>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger error" }));
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      screen.getByRole("button", { name: "Trigger error" }),
    ).not.toBeNull();
    expect(onMount).toHaveBeenCalledTimes(2);
  });

  it("calls reload when Reload application is clicked", async () => {
    const user = userEvent.setup();
    const reloadPage = vi.fn();

    render(
      <RootErrorBoundary reloadPage={reloadPage}>
        <ThrowError message="Unexpected render failure" />
      </RootErrorBoundary>,
    );

    await user.click(
      screen.getByRole("button", { name: "Reload application" }),
    );

    expect(reloadPage).toHaveBeenCalledOnce();
  });

  it("shows the branded fallback for errors rendered through React Router", () => {
    const router = createMemoryRouter(
      [
        {
          element: (
            <RootErrorBoundary>
              <Outlet />
            </RootErrorBoundary>
          ),
          children: [
            {
              path: "/",
              element: <ThrowError message="Route render failure" />,
            },
          ],
        },
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).not.toBeNull();
    expect(screen.queryByText("Unexpected Application Error!")).toBeNull();
  });
});
