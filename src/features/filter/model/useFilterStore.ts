import { create } from 'zustand';

interface FilterState {
  startDate?: Date;
  endDate?: Date;
  genres: string[];
  publishers: string[];
  setFilter: (next: Partial<FilterState>) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  startDate: undefined,
  endDate: undefined,
  genres: [],
  publishers: [],
  setFilter: (next) => set((prev) => ({ ...prev, ...next })),
  reset: () =>
    set({
      startDate: undefined,
      endDate: undefined,
      genres: [],
      publishers: [],
    }),
}));
