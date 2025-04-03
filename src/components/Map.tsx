
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

L.Marker.prototype.options.icon = DefaultIcon;

// Custom active marker icon
const ActiveIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [30, 45], // Slightly larger
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  className: 'active-marker', // Add a class for CSS styling
});

interface MapRecenterProps {
  position: [number, number];
  zoom?: number;
}

// Component to handle map recentering when selection changes
const MapRecenter: React.FC<MapRecenterProps> = ({ position, zoom = 13 }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);
  
  return null;
};

interface StoreMapProps {
  className?: string;
}

const StoreMap: React.FC<StoreMapProps> = ({ className }) => {
  const { filteredStores, selectedStore, selectStore } = useStores();
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [mapZoom, setMapZoom] = useState(12);
  const [map, setMap] = useState<L.Map | null>(null);

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

  // Handler to select a store and close the popup
  const handleSelectStore = (id: string, popupRef: React.RefObject<L.Popup>) => {
    if (map && popupRef.current) {
      map.closePopup(popupRef.current);
    }
    selectStore(id);
  };

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <MapContainer 
        className="h-full w-full rounded-lg"
        center={mapCenter}
        zoom={mapZoom} 
        zoomControl={false}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredStores.map((store) => {
          const popupRef = React.createRef<L.Popup>();
          return (
            <Marker 
              key={store.id}
              position={[store.geo.latitude, store.geo.longitude]}
              icon={selectedStore?.id === store.id ? ActiveIcon : DefaultIcon}
              eventHandlers={{
                click: () => {
                  selectStore(store.id);
                },
              }}
            >
              <Popup ref={popupRef}>
                <div className="text-sm">
                  <h3 className="font-semibold text-store-primary">{store.name}</h3>
                  <p className="text-xs text-gray-600">{store.address.streetAddress}</p>
                  <p className="text-xs text-gray-600">
                    {store.address.addressLocality}, {store.address.addressRegion}
                  </p>
                  <button 
                    onClick={() => handleSelectStore(store.id, popupRef)} 
                    className="mt-2 text-xs font-semibold text-store-primary hover:text-store-secondary"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        <MapRecenter position={mapCenter} zoom={mapZoom} />
      </MapContainer>
    </div>
  );
};

export default StoreMap;
