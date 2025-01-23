import { create } from "zustand";

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: { id: string; email: string; name: string }) => void;
  lougout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  lougout: () => set({ user: null, isAuthenticated: false }),
}));
