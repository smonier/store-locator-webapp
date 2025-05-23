
import React from 'react';
import { useStores } from '../contexts/useStores';
import { MapPin, Clock, Phone, Globe, Accessibility, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './StoreDetails.module.css';

interface StoreDetailsProps {
  className?: string;
  onClose: () => void;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ className, onClose }) => {
  const { selectedStore } = useStores();
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'en'; // Fallback if undefined

  if (!selectedStore) return null;

  // Helper for formatting address
  const formatAddress = (store: typeof selectedStore) => {
    const { streetAddress, addressLocality, addressRegion, postalCode } = store.address;
    return `${streetAddress}, ${addressLocality}, ${addressRegion} ${postalCode}`;
  };

  // Group opening hours by identical times for better display
  const groupedHours = groupOpeningHours(selectedStore.openingHoursSpecification || [], t, locale);

  return (
    <div className={`${styles.card} ${className || ''}`}>
      <div className={styles.cardContent}>
        <div className={styles.flexRow}>
          {/* Column 1: Image */}
          <div className={styles.columnQuarter}>
            {selectedStore.image && (
              <div className={styles.imageContainer}>
                <img
                  src={selectedStore.image}
                  alt={selectedStore.name}
                  className={styles.image}
                />
                <button
                  onClick={onClose}
                  className={styles.closeButton}
                >
                  <X className={styles.iconSm} />
                </button>
              </div>
            )}
          </div>

          {/* Vertical separator */}
          <div className={`${styles.verticalDivider} ${styles.hideOnMobile}`} />

          {/* Column 2: Name & Description */}
          <div className={styles.columnQuarter}>
            <h2 className={styles.title}>{selectedStore.name}</h2>
            {selectedStore.description && (
              <p className={styles.description}>{selectedStore.description}</p>
            )}
            {/* Amenities */}
            {selectedStore.amenityFeature?.length > 0 && (
              <div className={styles.amenities}>
                <div className={styles.amenityHeader}>
                  <Accessibility className={styles.amenityIcon} />
                  <h3 className={styles.amenityTitle}>{t('storedetails.amenities')}</h3>
                </div>
                <div className={styles.badgeContainer}>
                  {selectedStore.amenityFeature.map((amenity) => (
                    <span key={amenity} className={styles.badge}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`${styles.verticalDivider} ${styles.hideOnMobile}`} />

          {/* Column 3: Address, Contact */}
          <div className={styles.columnQuarter}>
            <div className={styles.infoSection}>
              <MapPin className={styles.infoIcon} />
              <div>
                <h3 className={styles.infoTitle}>{t('storedetails.address')}</h3>
                <p className={styles.infoContent}>{formatAddress(selectedStore)}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.geo.latitude},${selectedStore.geo.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  {t('storedetails.directions')}
                </a>
              </div>
            </div>

            {selectedStore.telephone && (
              <div className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <a href={`tel:${selectedStore.telephone}`} className={styles.contactLink}>
                  {selectedStore.telephone}
                </a>
              </div>
            )}

            {selectedStore.url && (
              <div className={styles.contactItem}>
                <Globe className={styles.contactIcon} />
                <a
                  href={selectedStore.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  {t('storedetails.website')}
                </a>
              </div>
            )}
          </div>

          <div className={`${styles.verticalDivider} ${styles.hideOnMobile}`} />

          {/* Column 4: Hours & Amenities */}
          <div className={styles.columnQuarter}>
            {/* Hours */}
            {selectedStore.openingHoursSpecification && (
              <div>
                <div className={styles.infoSection}>
                  <Clock className={styles.infoIcon} />
                  <div>
                    <div className={styles.hoursHeader}>
                      <h3 className={styles.hoursTitle}>{t('storedetails.hours')}</h3>
                      <span className={isStoreOpenNow(selectedStore) ? styles.open : styles.closed}>
                        {isStoreOpenNow(selectedStore) ? t('storedetails.open') : t('storedetails.closed')}
                      </span>
                    </div>
                    <div>
                      {groupedHours.map((group, i) => (
                        <div key={i} className={styles.hoursItem}>
                          <span>{group.days}</span>
                          <span>{group.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function groupOpeningHours(
  hours: Array<{ dayOfWeek: string; opens: string; closes: string }>,
  t: (key: string) => string,
  locale: string
) {
  const daysOrder = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const sortedHours = [...hours].sort(
    (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
  );

  const result: Array<{ days: string; hours: string }> = [];
  let currentGroup: typeof hours = [];

  sortedHours.forEach((hour, index) => {
    if (
      index === 0 ||
      hour.opens !== sortedHours[index - 1].opens ||
      hour.closes !== sortedHours[index - 1].closes
    ) {
      if (currentGroup.length > 0) {
        result.push(formatHourGroup(currentGroup, t, locale));
        currentGroup = [];
      }
      currentGroup.push(hour);
    } else {
      currentGroup.push(hour);
    }

    if (index === sortedHours.length - 1 && currentGroup.length > 0) {
      result.push(formatHourGroup(currentGroup, t, locale));
    }
  });

  return result;
}

function formatHourGroup(
  group: Array<{ dayOfWeek: string; opens: string; closes: string }>,
  t: (key: string) => string,
  locale: string
) {
  const days = group.map(h => h.dayOfWeek);
  let daysText = '';

  const translateDay = (day: string) => t(`days.${day.toLowerCase()}`);

  if (days.length === 1) {
    daysText = translateDay(days[0]);
  } else if (days.length === 7) {
    daysText = t('days.everyday');
  } else if (
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].every(d => days.includes(d)) &&
    days.length === 5
  ) {
    daysText = t('days.weekdays');
  } else if (days.includes('Saturday') && days.includes('Sunday') && days.length === 2) {
    daysText = t('days.weekends');
  } else {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedDays = days.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    let rangeStart = -1;
    const ranges: string[] = [];

    daysOrder.forEach((day, i) => {
      if (sortedDays.includes(day)) {
        if (rangeStart === -1) rangeStart = i;
        if (!sortedDays.includes(daysOrder[i + 1])) {
          const range = rangeStart === i
            ? translateDay(daysOrder[rangeStart])
            : `${translateDay(daysOrder[rangeStart])} - ${translateDay(daysOrder[i])}`;
          ranges.push(range);
          rangeStart = -1;
        }
      }
    });

    daysText = ranges.join(', ');
  }

  const hours =
    group[0].opens === '00:00' && group[0].closes === '23:59'
      ? t('storedetails.allday', { defaultValue: '24 hours' })
      : `${formatTime(group[0].opens, locale)} - ${formatTime(group[0].closes, locale)}`;

  return { days: daysText, hours };
}

function formatTime(time: string, locale: string = 'en') {
  const [hours, minutes] = time.split(':').map(Number);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function isStoreOpenNow(store: { openingHoursSpecification?: Array<{ dayOfWeek: string; opens: string; closes: string }> }) {
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
  
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [opensHour, opensMinute] = todayHours.opens.split(':').map(Number);
  const [closesHour, closesMinute] = todayHours.closes.split(':').map(Number);
  
  const currentTime = currentHour * 60 + currentMinute;
  const opensTime = opensHour * 60 + opensMinute;
  const closesTime = closesHour * 60 + closesMinute;
  
  return currentTime >= opensTime && currentTime < closesTime;
}

export default StoreDetails;
