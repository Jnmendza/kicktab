import { FavoriteTeam } from "@/types/types";
import { create } from "zustand";
import { fetchUserData } from "@/lib/user";
import { FAVORITES_LIMIT } from "@/lib/constants";

interface UserStore {
  id: string | null;
  userName: string | null;
  favorites: FavoriteTeam[]; // Favorites saved in the DB
  loadingState: boolean;
  selectedFavorites: FavoriteTeam[]; // Favorites on deck
  setUser: (id: string, userName: string) => void;
  initializeUser: () => Promise<void>;
  fetchFavorites: (userId: string) => Promise<void>;
  isTeamInFavorites: (teamId: number) => void;
  addFavoriteToDeck: (teamId: number, teamCode: string) => void;
  removeFavoriteFromDeck: (teamId: number) => void;
  saveFavorites: () => Promise<void>;
  removeFavoriteFromDB: (teamId: number) => Promise<void>;
}

const useUserStore = create<UserStore>((set, get) => ({
  id: null,
  userName: null,
  favorites: [],
  loadingState: true,
  selectedFavorites: [],
  setUser: (id, userName) => set({ id, userName }),
  initializeUser: async () => {
    set({ loadingState: true });
    const userData = await fetchUserData();
    if (userData) set({ id: userData.id, userName: userData.userName });
    set({ loadingState: false });
  },
  fetchFavorites: async (userId) => {
    set({ loadingState: true });
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch favorites.");
      }

      const favoritesData = await response.json();
      set({
        favorites: favoritesData,
      });
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      set({ loadingState: false });
    }
  },
  isTeamInFavorites: (teamId: number) => {
    const state = get();
    return state.favorites.some((fav) => fav.teamId === teamId);
  },
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
  removeFavoriteFromDeck: (teamId) => {
    const { selectedFavorites } = get();
    set({
      selectedFavorites: selectedFavorites.filter(
        (fav) => fav.teamId !== teamId
      ),
    });
  },
  saveFavorites: async () => {
    const { selectedFavorites, id } = get();

    try {
      const response = await fetch(`/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: selectedFavorites }),
      });

      if (!response.ok) {
        throw new Error("Failed to save favorites");
      }

      // Refetch favorites from the database
      const refetchResponse = await fetch(`/api/favorites?userId=${id}`);
      if (!refetchResponse.ok) {
        throw new Error("Failed to refetch favorites.");
      }

      const refetchedFavorites = await refetchResponse.json();

      // Update the state with the refetched favorites
      set({
        favorites: refetchedFavorites,
        selectedFavorites: [], // Clear selectedFavorites
      });

      console.log("Favorites save and refetched successfully!");
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  },
  removeFavoriteFromDB: async (favoriteId) => {
    const { id } = get();

    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorites.");
      }

      // Refetch favorites from the db
      const refetchResponse = await fetch(`/api/favorites?userId=${id}`);
      if (!refetchResponse.ok) {
        throw new Error("Failed to refetch favorites.");
      }

      const refetchedFavorites = await refetchResponse.json();

      // Update the state with the refetched favorites
      set({ favorites: refetchedFavorites });
      console.log("Favorite removed and refetched successfully");
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  },
}));

export default useUserStore;
