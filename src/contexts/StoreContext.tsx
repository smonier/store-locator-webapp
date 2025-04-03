
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Store } from '../types/store';
import { mockStores } from '../lib/mock-data';
// In a real application, we would use the Apollo client instead of mock data
// import { useQuery } from '@apollo/client';
// import { GET_ALL_STORES } from '../lib/graphql/queries';

interface StoreContextType {
  stores: Store[];
  selectedStore: Store | null;
  selectStore: (id: string) => void;
  searchStores: (query: string) => void;
  filteredStores: Store[];
  loading: boolean;
  error: Error | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // In a real application, we would use this instead of useEffect with mockStores
  // const { data, loading, error } = useQuery(GET_ALL_STORES);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setStores(mockStores);
      setFilteredStores(mockStores);
      setLoading(false);
    }, 1000);
    
    // In a real application with Apollo:
    // if (data) {
    //   setStores(data.stores);
    //   setFilteredStores(data.stores);
    // }
  }, []);

  const selectStore = (id: string) => {
    const found = stores.find(store => store.id === id);
    setSelectedStore(found || null);
  };

  const searchStores = (query: string) => {
    if (!query) {
      setFilteredStores(stores);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = stores.filter(store => 
      store.name.toLowerCase().includes(lowercaseQuery) ||
      store.address.addressLocality.toLowerCase().includes(lowercaseQuery) ||
      store.address.addressRegion.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredStores(filtered);
  };

  return (
    <StoreContext.Provider value={{
      stores,
      selectedStore,
      selectStore,
      searchStores,
      filteredStores,
      loading,
      error
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};
