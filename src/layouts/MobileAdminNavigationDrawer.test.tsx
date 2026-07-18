import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import MobileAdminNavigationDrawer from "./MobileAdminNavigationDrawer";

const links = [
  { to: "/technicians", label: "Technicians" },
  { to: "/users", label: "Users" },
];

describe("MobileAdminNavigationDrawer", () => {
  it("opens accessibly and closes after navigation", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/technicians"]}>
        <MobileAdminNavigationDrawer links={links} />
      </MemoryRouter>,
    );

    const openButton = screen.getByRole("button", {
      name: "Open admin navigation",
    });

    expect(openButton.getAttribute("aria-expanded")).toBe("false");

    await user.click(openButton);

    expect(openButton.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getByRole("dialog", { name: "Admin panel" }),
    ).not.toBeNull();
    const closeButton = screen.getByRole("button", {
      name: "Close admin navigation",
    });
    expect(closeButton).toBe(document.activeElement);
    expect(screen.getByRole("heading", { name: "Admin panel" })).not.toBeNull();
    expect(
      screen
        .getByRole("link", { name: "Technicians" })
        .getAttribute("aria-current"),
    ).toBe("page");

    await user.click(screen.getByRole("link", { name: "Users" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Close admin navigation" }),
      ).toBeNull();
    });
    expect(openButton.getAttribute("aria-expanded")).toBe("false");
    expect(openButton).toBe(document.activeElement);
  });
});
