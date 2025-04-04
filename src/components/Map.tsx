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
      className: 'custom-div-icon active-marker',
      html: `<img src="${iconUrl}" style="width:25px;height:41px; filter: hue-rotate(230deg) saturate(8);"/>`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
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