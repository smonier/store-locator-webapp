
import React from 'react';
import { useStores } from '../contexts/useStores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Phone, Globe, Accessibility, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      <Card className={`overflow-hidden ${className || ''}`}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Column 1: Image */}
            <div className="md:w-1/4 flex-shrink-0">
              {selectedStore.image && (
                  <div className="relative w-full h-40 md:h-48 rounded overflow-hidden">
                    <img
                        src={selectedStore.image}
                        alt={selectedStore.name}
                        className="w-full h-full object-cover"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-2 left-2 text-white bg-black/30 hover:bg-black/40"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
              )}
            </div>

            {/* Vertical separator */}
            <div className="hidden md:block w-px bg-border" />

            {/* Column 2: Name & Description */}
            <div className="md:w-1/4 space-y-2">
              <h2 className="text-lg font-bold">{selectedStore.name}</h2>
              {selectedStore.description && (
                  <p className="text-sm text-muted-foreground">{selectedStore.description}</p>
              )}
              {/* Amenities */}
              {selectedStore.amenityFeature?.length > 0 && (
                  <div>
                  <div className="flex items-center">
                    <Accessibility className="h-4 w-4 text-store-primary mr-2"/>
                    <h3 className="text-sm font-medium mt-2 mb-2">{t('storedetails.amenities')}</h3>
                  </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStore.amenityFeature.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                      ))}
                    </div>
                  </div>
              )}
            </div>

            <div className="hidden md:block w-px bg-border" />

            {/* Column 3: Address, Contact */}
            <div className="md:w-1/4 space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-store-primary mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">{t('storedetails.address')}</h3>
                  <p className="text-sm text-muted-foreground">{formatAddress(selectedStore)}</p>
                  <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.geo.latitude},${selectedStore.geo.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-store-primary hover:text-store-secondary hover:underline mt-1 inline-block"
                  >
                    {t('storedetails.directions')}
                  </a>
                </div>
              </div>

              {selectedStore.telephone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-store-primary mr-2" />
                    <a href={`tel:${selectedStore.telephone}`} className="text-sm hover:underline">
                      {selectedStore.telephone}
                    </a>
                  </div>
              )}

              {selectedStore.url && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-store-primary mr-2" />
                    <a
                        href={selectedStore.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline text-store-primary truncate"
                    >
                      {t('storedetails.website')}
                    </a>
                  </div>
              )}
            </div>

            <div className="hidden md:block w-px bg-border" />

            {/* Column 4: Hours & Amenities */}
            <div className="md:w-1/4 space-y-4">
              {/* Hours */}
              {selectedStore.openingHoursSpecification && (
                  <div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-store-primary mr-2 mt-0.5" />
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{t('storedetails.hours')}</h3>
                          <Badge variant={isStoreOpenNow(selectedStore) ? 'success' : 'destructive'}>
                            {isStoreOpenNow(selectedStore) ? t('storedetails.open') : t('storedetails.closed')}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm">
                          {groupedHours.map((group, i) => (
                              <div key={i} className="flex justify-between text-muted-foreground text-xs mb-1">
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
        </CardContent>
      </Card>
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
