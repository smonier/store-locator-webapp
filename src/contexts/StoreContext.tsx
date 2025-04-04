import { createContext } from 'react';
import { Store } from '../types/store';

export interface StoreContextType {
  stores: Store[];
  selectedStore: Store | null;
  selectStore: (idOrStore: string | Store) => void;
  searchStores: (query: string) => void;
  filteredStores: Store[];
  loading: boolean;
  error: Error | null;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);