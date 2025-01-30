import { FavoriteTeam } from "@/types/types";
import { create } from "zustand";
import { fetchUserData } from "@/lib/user";
import { FAVORITES_LIMIT } from "@/lib/constants";

interface UserStore {
  id: string | null;
  userName: string | null;
  favorites: FavoriteTeam[]; // Favorites saved in the DB
  loadingState: boolean;
  isSaving: boolean;
  selectedFavorites: FavoriteTeam[]; // Favorites on deck
  setUser: (id: string, userName: string) => void;
  initializeUser: () => Promise<void>;
  fetchFavorites: (userId: string) => Promise<void>;
  isTeamInFavorites: (teamId: number) => boolean;
  addFavoriteToDeck: (teamId: number, teamCode: string) => void;
  removeFavoriteFromDeck: (teamId: number) => void;
  saveFavorites: () => Promise<void>;
  removeFavoriteFromDB: (favoriteId: number) => Promise<void>;
}

const useUserStore = create<UserStore>((set, get) => ({
  id: null,
  userName: null,
  favorites: [],
  loadingState: true,
  isSaving: false,
  selectedFavorites: [],

  // Set user ID and username
  setUser: (id, userName) => set({ id, userName }),

  // Initialize user data
  initializeUser: async () => {
    set({ loadingState: true });
    const userData = await fetchUserData();
    if (userData) set({ id: userData.id, userName: userData.userName });
    set({ loadingState: false });
  },

  // Fetch favorites from the database
  fetchFavorites: async (userId) => {
    set({ loadingState: true });
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch favorites.");

      const favoritesData = await response.json();
      set({ favorites: favoritesData });
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      set({ loadingState: false });
    }
  },

  // Check if a team is already in favorites
  isTeamInFavorites: (teamId) => {
    const { favorites } = get();
    return favorites.some((fav) => fav.teamId === teamId);
  },

  // Add a team to the selected favorites (on-deck)
  addFavoriteToDeck: (teamId, teamCode) => {
    const { selectedFavorites, favorites } = get();
    const totalFavorites = selectedFavorites.length + favorites.length;

    if (totalFavorites < FAVORITES_LIMIT) {
      if (!selectedFavorites.some((fav) => fav.teamId === teamId)) {
        set({
          selectedFavorites: [...selectedFavorites, { teamId, teamCode }],
        });
      }
    } else {
      console.warn("Favorites limit reached!");
    }
  },

  // Remove a team from the selected favorites (on-deck)
  removeFavoriteFromDeck: (teamId) => {
    const { selectedFavorites } = get();
    set({
      selectedFavorites: selectedFavorites.filter(
        (fav) => fav.teamId !== teamId
      ),
    });
  },

  // Save selected favorites to the database
  saveFavorites: async () => {
    const { selectedFavorites, id } = get();
    set({ isSaving: true });

    try {
      // Save selected favorites to the database
      const saveResponse = await fetch(`/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: selectedFavorites }),
      });
      if (!saveResponse.ok) throw new Error("Failed to save favorites.");

      // Refetch favorites from the database
      const refetchResponse = await fetch(`/api/favorites?userId=${id}`);
      if (!refetchResponse.ok) throw new Error("Failed to refetch favorites.");

      const refetchedFavorites = await refetchResponse.json();

      // Update state with the refetched favorites
      set({
        favorites: refetchedFavorites,
        selectedFavorites: [], // Clear selectedFavorites
        isSaving: false,
      });
    } catch (error) {
      console.error("Error saving favorites:", error);
      set({ isSaving: false });
    }
  },

  // Remove a favorite from the database
  removeFavoriteFromDB: async (favoriteId) => {
    const { id } = get();

    try {
      // Delete the favorite from the database
      const deleteResponse = await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      if (!deleteResponse.ok) throw new Error("Failed to remove favorite.");

      // Refetch favorites from the database
      const refetchResponse = await fetch(`/api/favorites?userId=${id}`);
      if (!refetchResponse.ok) throw new Error("Failed to refetch favorites.");

      const refetchedFavorites = await refetchResponse.json();

      // Update state with the refetched favorites
      set({ favorites: refetchedFavorites });
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  },
}));

export default useUserStore;
