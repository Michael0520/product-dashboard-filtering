import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Filter state interface
export interface FilterState {
  categories: string[];
  searchTerm: string;
  priceRange: {
    min: string;
    max: string;
  };
  onlyInStock: boolean;
  sort: {
    field: "price" | null;
    order: "asc" | "desc" | null;
  };
}

// Initial filter state
export const initialFilterState: FilterState = {
  categories: [],
  searchTerm: "",
  priceRange: {
    min: "",
    max: "",
  },
  onlyInStock: false,
  sort: {
    field: null,
    order: null,
  },
};

// Store types
interface ProductStore {
  // Filter preferences (persistent)
  filterState: FilterState;
  
  // Filter actions
  setFilterState: (filterState: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (min: string, max: string) => void;
  setSort: (field: "price" | null, order: "asc" | "desc" | null) => void;
}

// Create store with persistence
export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      // Initial state
      filterState: initialFilterState,
      
      // Filter management
      setFilterState: (filterState) => set({ filterState }),
      
      updateFilter: (key, value) => set((state) => ({
        filterState: {
          ...state.filterState,
          [key]: value
        }
      })),
      
      resetFilters: () => set({ filterState: initialFilterState }),
      
      toggleCategory: (category) => set((state) => {
        const categories = state.filterState.categories.includes(category)
          ? state.filterState.categories.filter(c => c !== category)
          : [...state.filterState.categories, category];
          
        return {
          filterState: {
            ...state.filterState,
            categories
          }
        };
      }),
      
      setPriceRange: (min, max) => set((state) => ({
        filterState: {
          ...state.filterState,
          priceRange: { min, max }
        }
      })),
      
      setSort: (field, order) => set((state) => ({
        filterState: {
          ...state.filterState,
          sort: { field, order }
        }
      })),
    }),
    {
      name: 'product-filter-preferences',
      partialize: (state) => ({ 
        filterState: state.filterState
      }),
    }
  )
);

// Selectors
export const useFilterState = () => useProductStore((state) => state.filterState); 