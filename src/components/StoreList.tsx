
import React from 'react';
import { Store } from '../types/store';
import { useStores } from '../contexts/useStores';
import { useTranslation } from 'react-i18next';
import styles from './StoreList.module.css';

interface StoreListProps {
  className?: string;
  onStoreClick?: () => void;
}

const StoreList: React.FC<StoreListProps> = ({ className, onStoreClick }) => {
  const { filteredStores, selectedStore, selectStore, loading } = useStores();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.storeItem}>
            <div className={`${styles.skeleton} ${styles.skeletonFull}`} />
            <div className={`${styles.skeleton} ${styles.skeletonHalf}`} />
            <div className={`${styles.skeleton} ${styles.skeletonTwoThirds}`} />
          </div>
        ))}
      </div>
    );
  }

  if (filteredStores.length === 0) {
    return (
      <div className={`${styles.noStores} ${className || ''}`}>
        <p>{t('storelist.nostore')}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
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
    <div 
      className={isSelected ? styles.storeItemSelected : styles.storeItem}
      onClick={onSelect}
    >
      <div className={styles.itemContent}>
        <div>
          <h3 className={isSelected ? `${styles.storeName} ${styles.storeNameSelected}` : styles.storeName}>
            {store.name}
          </h3>
          <p className={styles.storeLocation}>
            {store.address.addressLocality} {store.address.addressRegion ? `, ${store.address.addressRegion}` : ''}
          </p>
          {store.distance && (
            <p className={styles.storeDistance}>
              {store.distance.toFixed(1)} {t('storelist.miles')}
            </p>
          )}
        </div>
        {store.openingHoursSpecification && (
          <div>
            <span className={isStoreOpen(store) ? styles.openBadge : styles.closedBadge}>
              {isStoreOpen(store) ? t('storelist.open') : t('storelist.closed')}
            </span>
          </div>
        )}
      </div>
    </div>
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
