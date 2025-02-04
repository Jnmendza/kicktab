// src/components/Team/__tests__/TeamList.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import TeamList from "../TeamList";
import useUserStore from "@/store/userStore";
import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";

// Mock SWR so we can control its return values.
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Correctly mock useToast as a jest mock function returning an object by default.
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(() => ({ toast: jest.fn() })),
}));

// Sample teams data for tests.
const sampleTeams = [
  { id: 1, name: "Team A", code: "TMA" },
  { id: 2, name: "Team B", code: "TMB" },
];

describe("TeamList", () => {
  beforeEach(() => {
    // Wrap state updates in act.
    act(() => {
      useUserStore.setState({
        selectedFavorites: [{ teamId: 1, teamCode: "TMA" }],
        isSaving: false,
        saveFavorites: jest.fn().mockResolvedValue(undefined),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner when teams are loading", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<TeamList leagueId={2} />);
    expect(screen.getByText(/Loading Teams/i)).toBeInTheDocument();
  });

  test("renders error message if fetching teams fails", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: { message: "Failed to load" },
      isLoading: false,
    });

    render(<TeamList leagueId={2} />);
    expect(
      screen.getByText(/Error loading teams: Failed to load/i)
    ).toBeInTheDocument();
  });

  test("renders World Cup message when leagueId is 1", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: sampleTeams,
      error: undefined,
      isLoading: false,
    });

    render(<TeamList leagueId={1} />);
    expect(screen.getByText(/World Cup 2026 coming soon/i)).toBeInTheDocument();
  });

  test("renders teams list and Save Favorites button when data is loaded", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: sampleTeams,
      error: undefined,
      isLoading: false,
    });

    render(<TeamList leagueId={2} />);
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Team B")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save Favorites/i })
    ).toBeInTheDocument();
  });

  test("clicking Save Favorites button calls saveFavorites and shows success toast", async () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: sampleTeams,
      error: undefined,
      isLoading: false,
    });

    // Override saveFavorites with a jest mock, wrapped in act.
    act(() => {
      useUserStore.setState({
        saveFavorites: jest.fn().mockResolvedValue(undefined),
      });
    });
    const saveFavoritesMock = useUserStore.getState().saveFavorites;

    // Override the useToast hook's return value.
    const toastMock = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: toastMock });

    render(<TeamList leagueId={2} />);
    const button = screen.getByRole("button", { name: /Save Favorites/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(saveFavoritesMock).toHaveBeenCalled();
      expect(toastMock).toHaveBeenCalledWith({
        title: "Favorites saved successfully! 🎉",
        description: "Your selected teams are now saved.",
      });
    });
  });

  test("disables Save Favorites button when selectedFavorites is empty or isSaving is true", () => {
    // First scenario: selectedFavorites is empty.
    const { rerender } = render(<TeamList leagueId={2} />);
    act(() => {
      useUserStore.setState({ selectedFavorites: [] });
    });
    expect(
      screen.getByRole("button", { name: /Save Favorites/i })
    ).toBeDisabled();

    // Second scenario: isSaving is true.
    act(() => {
      useUserStore.setState({
        selectedFavorites: [{ teamId: 1, teamCode: "TMA" }],
        isSaving: true,
      });
    });
    rerender(<TeamList leagueId={2} />);
    expect(
      screen.getByRole("button", { name: /Save Favorites/i })
    ).toBeDisabled();
  });
});
