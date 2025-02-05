import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Search from "../Search";
import { League } from "@/types/types";

// Sample leagues data for the Search component
export const sampleLeagues: League[] = [
  {
    id: 10,
    name: "Premier League",
    type: "Football",
    country: "England",
    flagUrl: "england-flag.png",
    logoUrl: "premier-league-logo.png",
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 20,
    name: "La Liga",
    type: "Football",
    country: "Spain",
    flagUrl: "spain-flag.png",
    logoUrl: "la-liga-logo.png",
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Search", () => {
  // Alternative approach using role "combobox"
  test("renders default text when no league is selected", () => {
    render(
      <Search leagues={sampleLeagues} selectedId={null} onSelect={() => {}} />
    );
    // Query by role "combobox". Note that the element's role is set explicitly.
    expect(screen.getByRole("combobox")).toHaveTextContent(
      /Select a league\.\.\./i
    );
  });

  test("displays selected league name when a league is selected", () => {
    render(
      <Search leagues={sampleLeagues} selectedId={10} onSelect={() => {}} />
    );
    expect(screen.getByRole("combobox")).toHaveTextContent(/Premier League/i);
  });

  test("calls onSelect when a league is clicked", async () => {
    const onSelectMock = jest.fn();
    render(
      <Search
        leagues={sampleLeagues}
        selectedId={null}
        onSelect={onSelectMock}
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Premier League"));
    expect(onSelectMock).toHaveBeenCalledWith(10);
  });
});
