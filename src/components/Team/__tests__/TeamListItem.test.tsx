import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TeamListItem from "../TeamListItem";
import useUserStore from "@/store/userStore";

describe("TeamListItem", () => {
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
});
