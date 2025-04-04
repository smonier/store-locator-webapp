import { useContext } from 'react';
import { StoreContext } from './StoreContext';
import { Store } from '../types/store';


export const useStores = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStores must be used within a StoreProvider');
    }
    return context;
};


export function mapStoreNodesToStores(nodes: any[]): Store[] {
    return nodes.map((node) => ({
        id: node.uuid,
        name: node.name?.value || node.displayName,
        description: node.description?.value || '',
        telephone: node.telephone?.value || '',
        url: node.url?.value || node.internalUrl?.node?.url || '',
        priceRange: node.priceRange?.value || '',
        image: node.image?.node?.url ? `http://localhost:8080${node.image.node.url}` : '',
        amenityFeature: node.amenityFeature?.values || [],
        geo: {
            latitude: parseFloat(node.latitude?.value),
            longitude: parseFloat(node.longitude?.value)
        },
        address: {
            streetAddress: node.streetAddress?.value || '',
            addressLocality: node.addressLocality?.value || '',
            addressRegion: node.addressRegion?.value || '',
            postalCode: node.postalCode?.value || '',
            addressCountry: node.addressCountry?.value || ''
        },
        openingHoursSpecification: node.openingHours?.values.map((v: string) => JSON.parse(v)) || []
    }));
}