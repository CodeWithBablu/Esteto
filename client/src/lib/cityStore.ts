import { create } from "zustand";
import { City } from "./definations";

interface CityState {
  city: City | null;
  setCityState: (city: City) => void;
}

export const useCityStore = create<CityState>((set) => ({
  city: null,
  setCityState: (city: City) => set({ city }),
}));
