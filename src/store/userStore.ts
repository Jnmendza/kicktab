import { Favorite } from "@/types/types";
import { create } from "zustand";
import { fetchUserData } from "@/lib/user";
import axios from "axios";

interface UserStore {
  id: string | null;
  userName: string | null;
  favorites: Favorite[]; // Favorites saved in the DB
  loadingState: boolean;
  selectedFavorites: Favorite[]; // Favorites on deck
  setUser: (id: string, userName: string) => void;
  initializeUser: () => Promise<void>;
  fetchFavorites: (userId: string) => Promise<void>;
  isTeamInFavorites: (teamId: number) => void;
  addFavoriteToDeck: (teamId: number) => void;
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/favorites`,
        {
          params: { userId },
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const favorites = response.data;
        set({ favorites });
      } else {
        throw new Error("Failed to fetch favorites.");
      }
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
  addFavoriteToDeck: (teamId) => {
    const { selectedFavorites, favorites } = get();
    const totalFavorites = selectedFavorites.length + favorites.length;

    if (totalFavorites < 7) {
      if (!selectedFavorites.some((fav) => fav.teamId === teamId)) {
        set({ selectedFavorites: [...selectedFavorites, { teamId }] });
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
    const { selectedFavorites, favorites } = get();

    try {
      const response = await fetch(`/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: selectedFavorites }),
      });

      if (response.ok) {
        set({
          favorites: [...favorites, ...selectedFavorites],
          selectedFavorites: [],
        });

        console.log("Favorites saved successfully!");
      } else {
        throw new Error("Failed to save favorites.");
      }
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  },
  removeFavoriteFromDB: async (favoriteId) => {
    const { favorites } = get();
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        set({
          favorites: favorites.filter((fav) => fav.id !== favoriteId),
        });
        console.log("Favorite removed successfully!");
      } else {
        throw new Error("Failed to remove favorite.");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  },
}));

export default useUserStore;
