
import React from 'react';
import { Store } from '../types/store';
import { useStores } from '../contexts/useStores';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

interface StoreListProps {
  className?: string;
  onStoreClick?: () => void;}

const StoreList: React.FC<StoreListProps> = ({ className, onStoreClick }) => {
  const { filteredStores, selectedStore, selectStore, loading } = useStores();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={`flex flex-col space-y-4 ${className || ''}`}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (filteredStores.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className || ''}`}>
        <p className="text-muted-foreground">{t('storelist.nostore')}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-3 ${className || ''}`}>
      {filteredStores.map((store) => (
        <StoreListItem 
          key={store.id} 
          store={store} 
          isSelected={selectedStore?.id === store.id}
          onSelect={() => {
            selectStore(store.id);
            onStoreClick?.();
          }}
        />
      ))}
    </div>
  );
};

interface StoreListItemProps {
  store: Store;
  isSelected: boolean;
  onSelect: () => void;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ store, isSelected, onSelect }) => {
  const { t } = useTranslation();

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-store-accent/10 border-store-primary' 
          : 'hover:bg-muted/40'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between">
        <div>
          <h3 className={`font-medium ${isSelected ? 'text-store-primary' : 'text-foreground'}`}>
            {store.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {store.address.addressLocality}, {store.address.addressRegion}
          </p>
          {store.distance && (
            <p className="text-xs text-muted-foreground mt-1">
              {store.distance.toFixed(1)} {t('storelist.miles')}
            </p>
          )}
        </div>
        {store.openingHoursSpecification && (
          <div className="text-right">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isStoreOpen(store) 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
            {isStoreOpen(store) ? t('storelist.open') : t('storelist.closed')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Helper function to check if the store is currently open
function isStoreOpen(store: Store): boolean {

  if (!store.openingHoursSpecification || store.openingHoursSpecification.length === 0) {
    return false;
  }

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[now.getDay()];
  
  const todayHours = store.openingHoursSpecification.find(
    spec => spec.dayOfWeek === today
  );
  
  if (!todayHours) {
    return false;
  }
  
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const opensTime = parseInt(todayHours.opens.replace(':', ''));
  const closesTime = parseInt(todayHours.closes.replace(':', ''));
  
  return currentTime >= opensTime && currentTime < closesTime;
}

export default StoreList;
