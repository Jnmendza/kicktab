import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchContainer from "../SearchContainer";
import useSWR from "swr";
import { sampleLeagues } from "./Search.test";

// Mock SWR.
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("SearchContainer", () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReturnValue({
      data: sampleLeagues,
      error: undefined,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders watermark when no league is selected", () => {
    render(<SearchContainer />);
    expect(
      screen.getByText(/Select a league to search for clubs/i)
    ).toBeInTheDocument();
  });

  test("selects a league and renders TeamList", async () => {
    render(<SearchContainer />);
    expect(
      screen.getByText(/Select a league to search for clubs/i)
    ).toBeInTheDocument();

    // Using text query for the trigger.
    const trigger = screen.getByText(/Select a league\.\.\./i);
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
      expect(screen.getByText("La Liga")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Premier League"));

    await waitFor(() => {
      expect(
        screen.queryByText(/Select a league to search for clubs/i)
      ).not.toBeInTheDocument();
    });

    // Assuming TeamList renders a "Save Favorites" button.
    expect(
      screen.getByRole("button", { name: /Save Favorites/i })
    ).toBeInTheDocument();
  });

  test("renders FavoritesList", () => {
    render(<SearchContainer />);
    // Adjust according to what your FavoritesList renders.
    expect(screen.getByText(/favorites/i)).toBeInTheDocument();
  });
});
