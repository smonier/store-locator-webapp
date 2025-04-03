
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStores } from '../contexts/StoreContext';

// Fix for Leaflet marker icons not displaying
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define a custom marker icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Set default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

interface StoreMapProps {
  className?: string;
}

const StoreMap: React.FC<StoreMapProps> = ({ className }) => {
  const { filteredStores, selectedStore, selectStore } = useStores();
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef<L.Map | null>(null);

  // Update map center when selectedStore changes
  useEffect(() => {
    if (selectedStore) {
      setMapCenter([selectedStore.geo.latitude, selectedStore.geo.longitude]);
      setMapZoom(15);
    } else if (filteredStores.length > 0) {
      // If no store is selected but we have filtered results, center on the first one
      setMapCenter([filteredStores[0].geo.latitude, filteredStores[0].geo.longitude]);
      setMapZoom(12);
    }
  }, [selectedStore, filteredStores]);

  // Update map view when center/zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom]);

  // Handler to select a store and close the popup
  const handleSelectStore = (id: string) => {
    selectStore(id);
  };

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <MapContainer 
        className="h-full w-full rounded-lg"
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map: L.Map) => {
          mapRef.current = map;
          map.setView(mapCenter, mapZoom);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredStores.map((store) => {
          const isActive = selectedStore?.id === store.id;
          const markerRef = useRef<L.Marker>(null);
          
          // Add active class to marker
          useEffect(() => {
            if (markerRef.current && isActive) {
              const element = markerRef.current.getElement();
              if (element) {
                element.classList.add('active-marker');
              }
            } else if (markerRef.current) {
              const element = markerRef.current.getElement();
              if (element) {
                element.classList.remove('active-marker');
              }
            }
          }, [isActive]);
          
          return (
            <Marker 
              key={store.id}
              position={[store.geo.latitude, store.geo.longitude]}
              eventHandlers={{
                click: () => {
                  selectStore(store.id);
                },
              }}
              ref={markerRef}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold text-store-primary">{store.name}</h3>
                  <p className="text-xs text-gray-600">{store.address.streetAddress}</p>
                  <p className="text-xs text-gray-600">
                    {store.address.addressLocality}, {store.address.addressRegion}
                  </p>
                  <button 
                    onClick={() => handleSelectStore(store.id)}
                    className="mt-2 text-xs font-semibold text-store-primary hover:text-store-secondary"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default StoreMap;
