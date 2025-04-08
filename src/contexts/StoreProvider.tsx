import React, {useState, useEffect, useContext} from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_STORES } from '../lib/graphql/queries';
import { Store } from '../types/store';
import { StoreContext } from './StoreContext';
import { mapStoreNodesToStores } from './useStores'; // wherever you put it
import {JahiaCtx} from '../contexts'

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stores, setStores] = useState<Store[]>([]);
    const [filteredStores, setFilteredStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { locale, workspace, scope } = useContext(JahiaCtx);
    const browserLanguage = navigator.language.split('-')[0]; // e.g. "en-US" -> "en"
    const site = "/sites/"+scope;
    const { data, loading, error } = useQuery(GET_ALL_STORES, {
        variables: { language: locale , workspace: workspace, path: site },
        fetchPolicy: 'network-only'   // bypass cache in dev
    });
    useEffect(() => {
        if (data?.jcr?.nodesByCriteria?.nodes) {
            const mappedStores = mapStoreNodesToStores(data.jcr.nodesByCriteria.nodes);
            setStores(mappedStores);
            setFilteredStores(mappedStores);
        }
    }, [data]);


    const selectStore = (idOrStore: string | Store) => {
        if (typeof idOrStore === 'string') {
            const found = stores.find(store => store.id === idOrStore);
            setSelectedStore(found || null);
        } else {
            setSelectedStore(idOrStore);
        }
    };

    const searchStores = (query: string) => {
        if (!query) return setFilteredStores(stores);
        const lc = query.toLowerCase();
        setFilteredStores(
            stores.filter(store =>
                store.name.toLowerCase().includes(lc) ||
                store.address.addressLocality.toLowerCase().includes(lc) ||
                store.address.addressRegion.toLowerCase().includes(lc)
            )
        );
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