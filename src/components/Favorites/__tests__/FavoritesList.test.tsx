import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FavoritesList from "../FavoritesList";
import useUserStore from "@/store/userStore";
import { FAVORITES_LIMIT } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

// Mock the toast hook so we can intercept toast calls.
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("FavoritesList", () => {
  // Create a mock for toast.
  const mockToast = jest.fn();

  beforeEach(() => {
    // Set up the store state.
    useUserStore.setState({
      favorites: [
        { id: 1, teamId: 10, teamCode: "TMA" },
        { id: 2, teamId: 20, teamCode: "TMB" },
      ],
      removeFavoriteFromDB: jest.fn().mockResolvedValue(undefined),
    });
    // Ensure useToast returns our mock.
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders favorites count correctly", () => {
    render(<FavoritesList />);
    // Expect the header to display "Favorites" and the count.
    expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`2\\s*/\\s*${FAVORITES_LIMIT}`, "i"))
    ).toBeInTheDocument();
  });

  test("renders all favorites items", () => {
    render(<FavoritesList />);
    // Assuming your capitalizeFirstLetter function turns "TMA" into "Tma"
    expect(screen.getByText("Tma")).toBeInTheDocument();
    expect(screen.getByText("Tmb")).toBeInTheDocument();
  });

  test("removes favorite and shows success toast on click", async () => {
    render(<FavoritesList />);
    // Select the first remove icon.
    // (If possible, add data-testid="remove-favorite-1" on CircleMinus in your component.)
    // Otherwise, we use a selector for the SVG with the "cursor-pointer" class.
    const removeIcon = document.querySelector("svg.cursor-pointer");
    expect(removeIcon).toBeInTheDocument();
    fireEvent.click(removeIcon!);

    await waitFor(() => {
      // Expect the store's removeFavoriteFromDB to have been called with id 1.
      expect(useUserStore.getState().removeFavoriteFromDB).toHaveBeenCalledWith(
        1
      );
      // And a success toast should be shown.
      expect(mockToast).toHaveBeenCalledWith({
        title: "Favorite removed! ✅",
      });
    });
  });

  test("shows error toast on removal failure", async () => {
    // Update store to simulate failure.
    useUserStore.setState({
      removeFavoriteFromDB: jest
        .fn()
        .mockRejectedValue(new Error("Removal error")),
    });
    render(<FavoritesList />);
    const removeIcon = document.querySelector("svg.cursor-pointer");
    expect(removeIcon).toBeInTheDocument();
    fireEvent.click(removeIcon!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Failed to remove favorite. 😢",
        variant: "destructive",
      });
    });
  });
});
