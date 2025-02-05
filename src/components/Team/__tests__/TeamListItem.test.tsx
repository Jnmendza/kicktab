import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TeamListItem from "../TeamListItem";
import useUserStore from "@/store/userStore";
import { FAVORITES_LIMIT } from "@/lib/constants";

describe("TeamListItem", () => {
  beforeEach(() => {
    // Reset the store state before each test.
    useUserStore.setState({
      favorites: [],
      selectedFavorites: [],
      addFavoriteToDeck: jest.fn(),
      removeFavoriteFromDeck: jest.fn(),
    });
  });

  test("calls addFavoriteToDeck when Follow is clicked", () => {
    // Create a mock for addFavoirteToDeck.
    const addFavoriteToDeckMock = jest.fn();

    // Override the store's addFavoriteToDeck before rendering.
    useUserStore.setState(() => ({
      addFavoriteToDeck: addFavoriteToDeckMock,
    }));

    // Render the component with required props.
    render(<TeamListItem teamId={1} teamName='Team A' teamCode='TMA' />);

    // Simulate a click on the "Follow" button.
    fireEvent.click(screen.getByText("Follow"));

    // Assert that the mock was called with the expected arguments.
    expect(addFavoriteToDeckMock).toHaveBeenCalledWith(1, "TMA");
  });

  test("calls removeFavoriteFromDeck when selected is clicked", () => {
    // Set up a mock for removeFavoriteFromDeck.
    const removeFavoriteFromDeckMock = jest.fn();

    // Simulate the team already being selected.
    useUserStore.setState({
      selectedFavorites: [{ teamId: 1, teamCode: "TMA" }],
      removeFavoriteFromDeck: removeFavoriteFromDeckMock,
    });

    // Render the component.
    render(<TeamListItem teamId={1} teamName='Team A' teamCode='TMA' />);

    // The button text should now be "Selected".
    fireEvent.click(screen.getByText("Selected"));

    // Verify that removeFavoriteFromDeck was called.
    expect(removeFavoriteFromDeckMock).toHaveBeenCalledWith(1);
  });

  test("disables the button when favorites limit is reached and team is not selected", () => {
    // Fill the favorites array to simulate the limit being reached.
    const fakeFavorites = Array(FAVORITES_LIMIT).fill({
      teamId: 99,
      teamCode: "XYZ",
    });
    useUserStore.setState({
      favorites: fakeFavorites,
      selectedFavorites: [],
      addFavoriteToDeck: jest.fn(),
    });

    // Render the component.
    render(<TeamListItem teamId={1} teamName='Team A' teamCode='TMA' />);

    // Get the button by its role.
    const button = screen.getByRole("button", { name: /follow/i });
    // It should be disabled because the limit is reached.
    expect(button).toBeDisabled();
  });

  test("shows 'Following' when team is already in favorites", () => {
    // Simulate that the team is already in favorites.
    useUserStore.setState({
      favorites: [{ teamId: 1, teamCode: "TMA" }],
    });

    // Render the component.
    render(<TeamListItem teamId={1} teamName='Team A' teamCode='TMA' />);

    // Expect the button text to be "Following".
    expect(screen.getByText("Following")).toBeInTheDocument();
  });
});
