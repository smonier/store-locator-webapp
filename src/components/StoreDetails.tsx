
import React from 'react';
import { useStores } from '../contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Phone, Globe, ChevronLeft } from 'lucide-react';

interface StoreDetailsProps {
  className?: string;
  onClose: () => void;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ className, onClose }) => {
  const { selectedStore } = useStores();

  if (!selectedStore) return null;

  // Helper for formatting address
  const formatAddress = (store: typeof selectedStore) => {
    const { streetAddress, addressLocality, addressRegion, postalCode } = store.address;
    return `${streetAddress}, ${addressLocality}, ${addressRegion} ${postalCode}`;
  };

  // Group opening hours by identical times for better display
  const groupedHours = groupOpeningHours(selectedStore.openingHoursSpecification || []);

  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <CardHeader className="p-0">
        {selectedStore.image && (
          <div className="relative h-48 w-full">
            <img
              src={selectedStore.image}
              alt={selectedStore.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="absolute top-2 left-2 text-white bg-black/30 hover:bg-black/40"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className={`p-4 ${selectedStore.image ? '-mt-12 relative' : ''}`}>
          <CardTitle className={`${selectedStore.image ? 'text-black' : 'text-foreground'} text-xl`}>
            {selectedStore.name}
          </CardTitle>
          {selectedStore.description && (
            <p className={`mt-2 text-sm ${selectedStore.image ? 'text-black/90' : 'text-muted-foreground'}`}>
              {selectedStore.description}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Address */}
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-store-primary mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium">Address</h3>
            <p className="text-sm text-muted-foreground">{formatAddress(selectedStore)}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.geo.latitude},${selectedStore.geo.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-store-primary hover:text-store-secondary hover:underline mt-1 inline-block"
            >
              Get Directions
            </a>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Hours */}
        {selectedStore.openingHoursSpecification && (
          <>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-store-primary mr-2 mt-0.5" />
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Hours</h3>
                  <Badge variant={isStoreOpenNow(selectedStore) ? 'success' : 'destructive'} className="text-[10px]">
                    {isStoreOpenNow(selectedStore) ? 'OPEN NOW' : 'CLOSED'}
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
            <Separator className="my-2" />
          </>
        )}

        {/* Contact */}
        <div className="grid grid-cols-1 gap-3">
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
                Visit Website
              </a>
            </div>
          )}
        </div>

        {/* Amenities */}
        {selectedStore.amenityFeature && selectedStore.amenityFeature.length > 0 && (
          <>
            <Separator className="my-2" />
            <div>
              <h3 className="text-sm font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStore.amenityFeature.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to group opening hours that are the same
function groupOpeningHours(hours: Array<{ dayOfWeek: string; opens: string; closes: string }>) {
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Sort hours by day of week according to our order
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
      // Start a new group
      if (currentGroup.length > 0) {
        result.push(formatHourGroup(currentGroup));
        currentGroup = [];
      }
      currentGroup.push(hour);
    } else {
      // Add to existing group
      currentGroup.push(hour);
    }
    
    // Handle the last item
    if (index === sortedHours.length - 1 && currentGroup.length > 0) {
      result.push(formatHourGroup(currentGroup));
    }
  });
  
  return result;
}

function formatHourGroup(group: Array<{ dayOfWeek: string; opens: string; closes: string }>) {
  const days = group.map(h => h.dayOfWeek);
  let daysText = '';
  
  if (days.length === 1) {
    daysText = days[0];
  } else if (days.length === 7) {
    daysText = 'Every day';
  } else if (
    days.includes('Monday') &&
    days.includes('Tuesday') &&
    days.includes('Wednesday') &&
    days.includes('Thursday') &&
    days.includes('Friday') &&
    days.length === 5
  ) {
    daysText = 'Weekdays';
  } else if (days.includes('Saturday') && days.includes('Sunday') && days.length === 2) {
    daysText = 'Weekends';
  } else {
    // For consecutive days, show as ranges
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedDays = days.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));
    
    let rangeStart = -1;
    const ranges: string[] = [];
    
    daysOrder.forEach((day, i) => {
      if (sortedDays.includes(day)) {
        if (rangeStart === -1) rangeStart = i;
        if (!sortedDays.includes(daysOrder[i + 1])) {
          const range = rangeStart === i
            ? daysOrder[rangeStart]
            : `${daysOrder[rangeStart].substring(0, 3)}-${daysOrder[i].substring(0, 3)}`;
          ranges.push(range);
          rangeStart = -1;
        }
      }
    });
    
    daysText = ranges.join(', ');
  }
  
  const hours = group[0].opens === '00:00' && group[0].closes === '23:59'
    ? '24 hours'
    : `${formatTime(group[0].opens)} - ${formatTime(group[0].closes)}`;
  
  return { days: daysText, hours };
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  let period = 'AM';
  let hour = hours;
  
  if (hours >= 12) {
    period = 'PM';
    hour = hours === 12 ? 12 : hours - 12;
  }
  
  hour = hour === 0 ? 12 : hour;
  
  return `${hour}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''} ${period}`;
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
