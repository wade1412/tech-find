import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeUnit } from "../../../../entities/unit/testing/unit.factory";
import { useUnitsQuery } from "../../../../entities/unit/useUnitsQuery";
import JobUnitSection from "./JobUnitSection";

vi.mock("../../../../entities/unit/useUnitsQuery", () => ({
  useUnitsQuery: vi.fn(),
}));

afterEach(cleanup);

describe("Job Options with Unit Selector", () => {
  it("keeps Gas while a compatible unit is selected and clears when compatible unit has been deselected", async () => {
    const units = [
      makeUnit({
        id: "dryer",
        name: "Dryer",
        slug: "dryer",
        can_be_gas: true,
      }),
      makeUnit({
        id: "washer",
        name: "Washer",
        slug: "washer",
        can_be_gas: false,
      }),
    ];

    vi.mocked(useUnitsQuery).mockReturnValue({
      data: units,
      isPending: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useUnitsQuery>);

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <JobUnitSection />,
        },
      ],
      { initialEntries: ["/"] },
    );

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);

    const gas = screen.getByRole("checkbox", {
      name: "Gas",
    }) as HTMLInputElement;
    const dryer = screen.getByRole("button", { name: "Dryer" });
    const washer = screen.getByRole("button", { name: "Washer" });

    // 1) Gas Job Option disabled when no units are selected
    expect(gas.disabled).toBe(true);

    // 2) Gas Job Option enabled, when the Dryer is selected, because Dryer can be gas
    await user.click(dryer);
    expect(dryer.getAttribute("aria-pressed")).toBe("true");
    expect(gas.disabled).toBe(false);

    // 3) Checking Gas Job Option changes the checkbox and the URL
    await user.click(gas);
    expect(gas.checked).toBe(true);
    expect(new URLSearchParams(router.state.location.search).get("gas")).toBe(
      "1",
    );

    // 4) Washer can be added to a mixed order and it does not uncheck the gas job option
    await user.click(washer);
    expect(dryer.getAttribute("aria-pressed")).toBe("true");
    expect(washer.getAttribute("aria-pressed")).toBe("true");
    expect(gas.checked).toBe(true);

    // 5) After Dryer has been deselected the gas job option should be unchecked and disabled and the url search param cleared, since there wont be any selected units that have gas property
    await user.click(dryer);
    expect(dryer.getAttribute("aria-pressed")).toBe("false");
    expect(washer.getAttribute("aria-pressed")).toBe("true");

    await waitFor(() => {
      expect(gas.checked).toBe(false);
      expect(gas.disabled).toBe(true);
      expect(
        new URLSearchParams(router.state.location.search).get("gas"),
      ).toBeNull();
    });
  });
});
