import useUserStore from "../userStore";
import { FAVORITES_LIMIT } from "@/lib/constants";

describe("User Store", () => {
  // Run this before each test to ensure a clean store state.
  beforeEach(() => {
    useUserStore.setState({
      id: null,
      userName: null,
      favorites: [],
      loadingState: true,
      isSaving: true,
      selectedFavorites: [],
    });
  });

  test("setUser sets id and userName", () => {
    // Call the setUser function with test values.
    useUserStore.getState().setUser("1", "Jon");
    // Get the updated state.
    const state = useUserStore.getState();
    // Verify that the sate has been updated correctly.
    expect(state.id).toBe("1");
    expect(state.userName).toBe("Jon");
  });

  test("addFavoriteToDeck adds team if under limit", () => {
    // Call the function to add a team to the selectedFavorites.
    useUserStore.getState().addFavoriteToDeck(1, "TMA");
    // Retrieve the updated state.
    const state = useUserStore.getState();
    // Check that the team was added to the selectedFavorites array
    expect(state.selectedFavorites).toEqual([{ teamId: 1, teamCode: "TMA" }]);
  });

  test("addFavoriteToDeck does not add duplicate team", () => {
    // Destructure the function from the store.
    const { addFavoriteToDeck } = useUserStore.getState();
    // Attempt to add the same team twice.
    addFavoriteToDeck(1, "TMA");
    addFavoriteToDeck(1, "TMA");
    // Retrieve state and check that the team only appears once.
    const state = useUserStore.getState();
    expect(state.selectedFavorites.length).toBe(1);
  });

  test("addFavoriteToDeck warns if favorites limit is reached", () => {
    // Simulate the favorites array being full by pre-filling it.
    useUserStore.setState({
      favorites: Array(FAVORITES_LIMIT).fill({ teamId: 0, teamCode: "ABC" }),
    });
    // Spy on console.warn to catch the warning message.
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    // Attempt to add a new team; since the limit is reached, it should not be added
    useUserStore.getState().addFavoriteToDeck(2, "TMB");
    const state = useUserStore.getState();
    // Verify that no new team was added.
    expect(state.selectedFavorites).toEqual([]);
    // Verify that the warning was logged.
    expect(consoleWarnSpy).toHaveBeenCalledWith("Favorites limit reached");
    // Restore the original console.warn implementation.
    consoleWarnSpy.mockRestore();
  });

  test("removeFavoritesFromDeck removes team", () => {
    const { addFavoriteToDeck, removeFavoriteFromDeck } =
      useUserStore.getState();
    // First, add a team.
    addFavoriteToDeck(1, "TMA");
    // Then, remove that team.
    removeFavoriteFromDeck(1);
    const state = useUserStore.getState();
    // Check that selectedFavorites is empty after removal.
    expect(state.selectedFavorites).toEqual([]);
  });
});
