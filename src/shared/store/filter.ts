import { create } from 'zustand';

interface FilterState {
  startDate?: Date;
  endDate?: Date;
  genres: string[];
  setFilter: (filter: Partial<FilterState>) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  genres: [],
  setFilter: (filter) => set((state) => ({ ...state, ...filter })),
}));
