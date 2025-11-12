import { create } from "zustand";

interface AdminState {
  token: string | null;
  user: any | null;
  setAdminData: (token: string, user: any) => void;
  clearAdmin: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  token: null,
  user: null,
  setAdminData: (token, user) => set({ token, user }),
  clearAdmin: () => set({ token: null, user: null }),
}));
