import { Store } from '../types/store';

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Downtown Superstore',
    description: 'Our flagship store in the heart of downtown Paris with the widest selection of products.',
    telephone: '+33-1-2345-6789',
    url: 'https://example.com/downtown',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
    address: {
      streetAddress: '101 Rue de Rivoli',
      addressLocality: 'Paris',
      addressRegion: 'Île-de-France',
      postalCode: '75001',
      addressCountry: 'FR'
    },
    geo: {
      latitude: 48.8606,
      longitude: 2.3376
    },
    openingHoursSpecification: [
      { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' },
      { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' },
      { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' },
      { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' },
      { dayOfWeek: 'Friday', opens: '09:00', closes: '22:00' },
      { dayOfWeek: 'Saturday', opens: '10:00', closes: '22:00' },
      { dayOfWeek: 'Sunday', opens: '10:00', closes: '20:00' }
    ],
    priceRange: '$$',
    amenityFeature: ['Parking', 'Wheelchair Accessible', 'WiFi']
  },
  {
    id: '2',
    name: 'Westside Branch',
    description: 'Convenient location in Lyon’s western district.',
    telephone: '+33-4-5678-9012',
    url: 'https://example.com/westside',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    address: {
      streetAddress: '25 Avenue des Frères Lumière',
      addressLocality: 'Lyon',
      addressRegion: 'Auvergne-Rhône-Alpes',
      postalCode: '69008',
      addressCountry: 'FR'
    },
    geo: {
      latitude: 45.7485,
      longitude: 4.8671
    },
    openingHoursSpecification: [
      { dayOfWeek: 'Monday', opens: '10:00', closes: '20:00' },
      { dayOfWeek: 'Tuesday', opens: '10:00', closes: '20:00' },
      { dayOfWeek: 'Wednesday', opens: '10:00', closes: '20:00' },
      { dayOfWeek: 'Thursday', opens: '10:00', closes: '20:00' },
      { dayOfWeek: 'Friday', opens: '10:00', closes: '21:00' },
      { dayOfWeek: 'Saturday', opens: '10:00', closes: '21:00' },
      { dayOfWeek: 'Sunday', opens: '11:00', closes: '19:00' }
    ],
    priceRange: '$$',
    amenityFeature: ['Parking', 'Wheelchair Accessible']
  },
  {
    id: '3',
    name: 'Southside Outlet',
    description: 'Discount outlet in Marseille for the best deals.',
    telephone: '+33-4-9123-4567',
    url: 'https://example.com/southside',
    image: 'https://explorerresearch.com/wp-content/uploads/2022/07/luxury-brand-retail-store-design-1.jpg',
    address: {
      streetAddress: '87 Boulevard Rabatau',
      addressLocality: 'Marseille',
      addressRegion: 'Provence-Alpes-Côte d\'Azur',
      postalCode: '13008',
      addressCountry: 'FR'
    },
    geo: {
      latitude: 43.2707,
      longitude: 5.3900
    },
    openingHoursSpecification: [
      { dayOfWeek: 'Monday', opens: '10:00', closes: '19:00' },
      { dayOfWeek: 'Tuesday', opens: '10:00', closes: '19:00' },
      { dayOfWeek: 'Wednesday', opens: '10:00', closes: '19:00' },
      { dayOfWeek: 'Thursday', opens: '10:00', closes: '19:00' },
      { dayOfWeek: 'Friday', opens: '10:00', closes: '20:00' },
      { dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' },
      { dayOfWeek: 'Sunday', opens: '09:00', closes: '18:00' }
    ],
    priceRange: '$',
    amenityFeature: ['Parking']
  },
  {
    id: '4',
    name: 'Eastside Express',
    description: 'Quick service store in Lille’s vibrant east side.',
    telephone: '+33-3-2034-5678',
    url: 'https://example.com/eastside',
    image: 'https://i0.wp.com/40visuals.com/wp-content/uploads/Retail-store-signage-for-Gucci-scaled.jpeg?fit=2560%2C1707&ssl=1',
    address: {
      streetAddress: '11 Rue de Lannoy',
      addressLocality: 'Lille',
      addressRegion: 'Hauts-de-France',
      postalCode: '59800',
      addressCountry: 'FR'
    },
    geo: {
      latitude: 50.6272,
      longitude: 3.0805
    },
    openingHoursSpecification: [
      { dayOfWeek: 'Monday', opens: '08:00', closes: '22:00' },
      { dayOfWeek: 'Tuesday', opens: '08:00', closes: '22:00' },
      { dayOfWeek: 'Wednesday', opens: '08:00', closes: '22:00' },
      { dayOfWeek: 'Thursday', opens: '08:00', closes: '22:00' },
      { dayOfWeek: 'Friday', opens: '08:00', closes: '22:00' },
      { dayOfWeek: 'Saturday', opens: '08:00', closes: '22:00' },
      { dayOfWeek: 'Sunday', opens: '08:00', closes: '22:00' }
    ],
    priceRange: '$$',
    amenityFeature: ['Wheelchair Accessible', 'WiFi']
  },
  {
    id: '5',
    name: 'Northside Market',
    description: 'Gourmet market in Strasbourg offering fine foods.',
    telephone: '+33-3-8845-6789',
    url: 'https://example.com/northside',
    image: 'https://www.esperiri.com/wp-content/uploads/2020/11/luxury-shopping-milan-dolce-and-gabbana-boutique-milano-spiga.jpg',
    address: {
      streetAddress: '3 Place Kléber',
      addressLocality: 'Strasbourg',
      addressRegion: 'Grand Est',
      postalCode: '67000',
      addressCountry: 'FR'
    },
    geo: {
      latitude: 48.5846,
      longitude: 7.7508
    },
    openingHoursSpecification: [
      { dayOfWeek: 'Monday', opens: '09:00', closes: '20:00' },
      { dayOfWeek: 'Tuesday', opens: '09:00', closes: '20:00' },
      { dayOfWeek: 'Wednesday', opens: '09:00', closes: '20:00' },
      { dayOfWeek: 'Thursday', opens: '09:00', closes: '20:00' },
      { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' },
      { dayOfWeek: 'Saturday', opens: '09:00', closes: '21:00' },
      { dayOfWeek: 'Sunday', opens: '10:00', closes: '19:00' }
    ],
    priceRange: '$$$',
    amenityFeature: ['Parking', 'Wheelchair Accessible', 'WiFi', 'Coffee Shop']
  }
];
