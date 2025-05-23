
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStores } from '../contexts/useStores';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from './Map.module.css';

// Default Leaflet marker icon
const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Create a custom active icon using divIcon
const createActiveIcon = () =>
    L.divIcon({
        className: 'custom-div-icon',
        html: `
      <div style="width: 25px; height: 41px;">
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12.5 0C5.6 0 0 5.6 0 12.5C0 22 12.5 41 12.5 41C12.5 41 25 22 25 12.5C25 5.6 19.4 0 12.5 0Z" 
            fill="#8D1700"
          />
          <circle cx="12.5" cy="12.5" r="5" fill="white"/>
        </svg>
      </div>
    `,
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        className: '', // prevent Leaflet from applying its default green marker styles
    });

interface StoreMapProps {
  className?: string;
  onStoreClick?: () => void;
}

const FitBoundsOnMount = ({ stores }) => {
    const map = useMap();

    useEffect(() => {
        if (stores.length === 0) return;
        const bounds = L.latLngBounds(stores.map(store => [store.geo.latitude, store.geo.longitude]));
        map.fitBounds(bounds, { padding: [30, 30] });
    }, [stores, map]);

    return null;
};

const StoreMap: React.FC<StoreMapProps> = ({ className, onStoreClick }) => {
  const { filteredStores, selectedStore, selectStore } = useStores();
  const mapInitialized = useRef(false);
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Set initial map center and zoom
  const initialPosition = filteredStores.length > 0 
    ? [filteredStores[0].geo.latitude, filteredStores[0].geo.longitude] 
    : [37.7749, -122.4194];
  
  const initialZoom = 12;

  // Helper component to set map ref via useMap
  const SetMapRef = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!mapInitialized.current) {
        mapRef.current = map;
        mapInitialized.current = true;
        setMapReady(true);
      }
    }, [map]);
    
    return null;
  };

  // Effect to handle selected store changes
  useEffect(() => {
    if (selectedStore && mapRef.current && mapReady) {
      mapRef.current.setView(
        [selectedStore.geo.latitude - 0.007, selectedStore.geo.longitude],
        15
      );
    } else if (!selectedStore && filteredStores.length > 0 && mapRef.current && mapReady) {
      const bounds = L.latLngBounds(filteredStores.map(s => [s.geo.latitude, s.geo.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [selectedStore, filteredStores, mapReady]);

  return (
    <div className={`${styles.mapContainer} ${className || ''}`}>
      <MapContainer
        center={initialPosition as [number, number]}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className={styles.mapInner}
        whenReady={() => {}}
      >
        <SetMapRef />
        <FitBoundsOnMount stores={filteredStores} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredStores.map((store) => {
          const isActive = selectedStore?.id === store.id;
          return (
            <Marker
              key={store.id}
              position={[store.geo.latitude, store.geo.longitude]}
              icon={isActive ? createActiveIcon() : defaultIcon}
              eventHandlers={{ 
                click: () => {
                  selectStore(store.id);
                  onStoreClick?.();
                }
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default StoreMap;
