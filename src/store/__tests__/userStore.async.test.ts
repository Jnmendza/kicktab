import useUserStore from "../userStore";
import { fetchUserData } from "@/lib/user";

// Mock the fetchUserData module so we can control its output.
jest.mock("@/lib/user", () => ({
  fetchUserData: jest.fn(),
}));

describe("User Store Async Functions", () => {
  // Reset the store state before each test.
  beforeEach(() => {
    useUserStore.setState({
      id: null,
      userName: null,
      favorites: [],
      loadingState: true,
      isSaving: false,
      selectedFavorites: [],
    });
  });

  // If fetch is not defined, define it as a jest.fn().
  if (!global.fetch) {
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn();
  }

  test("initializeUser sets user data correctly", async () => {
    // Arrange: Set up the mock to resolve with test data.
    const mockUserData = { id: "123", userName: "Jon" };
    (fetchUserData as jest.Mock).mockResolvedValue(mockUserData);

    // Act: Call initializeUser and wait for it to complete.
    await useUserStore.getState().initializeUser();

    // Assert: Verify the state was updated and loadingState is false.
    const state = useUserStore.getState();
    expect(state.id).toBe("123");
    expect(state.userName).toBe("Jon");
    expect(state.loadingState).toBe(false);
  });

  test("fetchFavorites fetches favorites and updates state", async () => {
    // Arrange: Create mock favorites data.
    const mockFavorites = [{ teamId: 1, teamCode: "TMA" }];

    // Use jest.spyOn to mock global.fetch so that it is properly overridden.
    const fetchSpy = jest
      .spyOn(global as unknown as { fetch: jest.Mock }, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => mockFavorites,
      } as Response);

    // Act: Call fetchFavorites with a test userId.
    await useUserStore.getState().fetchFavorites("123");

    // Assert: Get the updated state.
    const state = useUserStore.getState();
    expect(state.favorites).toEqual(mockFavorites);
    expect(state.loadingState).toBe(false);

    // Optionally verify that fetch was called with the correct URL.
    expect(fetchSpy).toHaveBeenCalledWith("/api/favorites?userId=123");

    // Clean up the mock.
    fetchSpy.mockRestore();
  });

  test("saveFavorites saves and refetches favorites", async () => {
    //Forecefully set id to '123' again to ensure it hasn't been overwritten.
    useUserStore.setState({ id: "123" });

    // Arrange:
    // Create mock favorites data that will be returned by the refetch.
    const refetchedFavorites = [{ teamId: 1, teamCode: "TMA" }];

    // Create a spy for fetch so we can control multiple responses.
    const fetchSpy = jest.spyOn(
      global as unknown as { fetch: jest.Mock },
      "fetch"
    );

    // First call is for saving favorites (POST).
    // Second call is for refetching favorites (GET).
    // We'll simulate both calls:
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        // no json needed for the POST response in this case.
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => refetchedFavorites,
      } as Response);

    // Act: call saveFavorites.
    await useUserStore.getState().saveFavorites();

    // Assert:
    const state = useUserStore.getState();
    // Check that favorites got updated and selectedFavorites got cleared.
    expect(state.favorites).toEqual(refetchedFavorites);
    expect(state.selectedFavorites).toEqual([]);
    // Also check that isSaving flag is turned off.
    expect(state.isSaving).toBe(false);

    // Verify fetch was called with the expected parameters.
    // First call: POST to /api/favorites with selectedFavorites payload.
    expect(fetchSpy.mock.calls[0][0]).toBe("/api/favorites");
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({
      method: "POST",
    });
    // Second call: GET to /api/favorites with userId query.
    expect(fetchSpy.mock.calls[1][0]).toBe("/api/favorites?userId=123");

    // Cleanup:
    fetchSpy.mockRestore();
  });

  test("removeFavoriteFromDB removes a favorite and refetches favorites", async () => {
    //Forecefully set id to '123' again to ensure it hasn't been overwritten.
    useUserStore.setState({ id: "123" });

    // Arrange:
    // This is the updated favorites array returned by the refetch.
    const refetchedFavorites: never[] = []; // assume favorite was removed

    // Create a spy on global.fetch to control responses.
    const fetchSpy = jest.spyOn(
      global as unknown as { fetch: jest.Mock },
      "fetch"
    );

    // First call: DELETE request.
    // Second call: GET request to refetch favorites.
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        // No json for DELETE response.
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => refetchedFavorites,
      } as Response);

    // Act: Call removeFavoriteFromDB for a given favoriteId.
    await useUserStore.getState().removeFavoriteFromDB(1);

    // Assert:
    const state = useUserStore.getState();
    // The favorites should now be updated to the refetched (empty)
    expect(state.favorites).toEqual(refetchedFavorites);

    // Optionally check that fetch was called correctly.
    // DELETE request:
    expect(fetchSpy.mock.calls[0][0]).toBe("/api/favorites/1");
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({
      method: "DELETE",
    });
    // GET request:
    expect(fetchSpy.mock.calls[1][0]).toBe("/api/favorites?userId=123");

    // Cleanup the fetch spy.
    fetchSpy.mockRestore();
  });
});
