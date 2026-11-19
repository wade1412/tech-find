import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import ManageSpecificIssueCard from "./ManageSpecificIssueCard";
import { makeIssue } from "../../../../entities/specific-issue/testing/specific-issue.factory";
import { makeUnit } from "../../../../entities/unit/testing/unit.factory";

const issue = makeIssue({
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  id: "issue-1",
  name: "No Heat",
  slug: "no-heat",
  unit_id: "unit-1",
});

const unit = makeUnit({
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  can_be_commercial: false,
  can_be_gas: false,
  can_be_stacked: false,
  display_order: 10,
  id: "unit-1",
  is_built_in: false,
  name: "Dryer",
  slug: "dryer",
});

describe("ManageSpecificIssueCard", () => {
  it("shows the related unit and edit route", () => {
    render(
      <MemoryRouter>
        <ManageSpecificIssueCard specificIssue={issue} unit={unit} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dryer")).toBeTruthy();
    expect(screen.getByText("no-heat")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /No Heat/ }).getAttribute("href"),
    ).toBe("/specific-issues/issue-1/edit");
  });

  it("shows when the related unit is inactive", () => {
    render(
      <MemoryRouter>
        <ManageSpecificIssueCard
          specificIssue={issue}
          unit={{ ...unit, active: false }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Unit inactive")).toBeTruthy();
  });
});
