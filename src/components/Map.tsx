import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStores } from '../contexts/useStores';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
}

const StoreMap: React.FC<StoreMapProps> = ({ className }) => {
  const { filteredStores, selectedStore, selectStore } = useStores();
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (selectedStore) {
      setMapCenter([selectedStore.geo.latitude, selectedStore.geo.longitude]);
      setMapZoom(15);
    } else if (filteredStores.length > 0) {
      setMapCenter([filteredStores[0].geo.latitude, filteredStores[0].geo.longitude]);
      setMapZoom(12);
    }
  }, [selectedStore, filteredStores]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom]);

  // Helper component to set map ref via useMap
  const SetMapRef = () => {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    return null;
  };

  return (
      <div className={`w-full h-full ${className || ''}`}>
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="h-full w-full rounded-lg"
            style={{ height: '100%', width: '100%' }}
        >
          <SetMapRef />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredStores.map((store) => {
            const isActive = selectedStore?.id === store.id;
            return (
                <Marker
                    key={store.id}
                    position={[store.geo.latitude, store.geo.longitude]}
                    icon={isActive ? createActiveIcon() : defaultIcon}
                    eventHandlers={{
                      click: () => selectStore(store.id),
                    }}
                >
                  {/*<Popup>
                    <div className="text-sm">
                      <h3 className="font-semibold text-store-primary">{store.name}</h3>
                      <p className="text-xs text-gray-600">{store.address.streetAddress}</p>
                      <p className="text-xs text-gray-600">
                        {store.address.addressLocality}, {store.address.addressRegion}
                      </p>
                      <button
                          onClick={() => selectStore(store)}
                          className="mt-2 text-xs font-semibold text-store-primary hover:text-store-secondary"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>*/}
                </Marker>
            );
          })}
        </MapContainer>
      </div>
  );
};

export default StoreMap;