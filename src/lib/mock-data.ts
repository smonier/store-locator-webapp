
import { Store } from '../types/store';

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Downtown Superstore',
    description: 'Our flagship store in the heart of downtown with the widest selection of products.',
    telephone: '+1-555-123-4567',
    url: 'https://example.com/downtown',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    address: {
      streetAddress: '123 Main Street',
      addressLocality: 'Anytown',
      addressRegion: 'CA',
      postalCode: '94103',
      addressCountry: 'US'
    },
    geo: {
      latitude: 37.7749,
      longitude: -122.4194
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
    description: 'Convenient location serving the western neighborhoods.',
    telephone: '+1-555-987-6543',
    url: 'https://example.com/westside',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    address: {
      streetAddress: '456 Ocean Avenue',
      addressLocality: 'Anytown',
      addressRegion: 'CA',
      postalCode: '94122',
      addressCountry: 'US'
    },
    geo: {
      latitude: 37.7639,
      longitude: -122.4784
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
    description: 'Our discount outlet with great deals every day.',
    telephone: '+1-555-345-6789',
    url: 'https://example.com/southside',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd149?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    address: {
      streetAddress: '789 Industrial Blvd',
      addressLocality: 'Anytown',
      addressRegion: 'CA',
      postalCode: '94124',
      addressCountry: 'US'
    },
    geo: {
      latitude: 37.7384,
      longitude: -122.3807
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
    description: 'Small format store for quick shopping trips.',
    telephone: '+1-555-234-5678',
    url: 'https://example.com/eastside',
    image: 'https://images.unsplash.com/photo-1604326531820-e463d4f79e0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    address: {
      streetAddress: '321 Park Road',
      addressLocality: 'Anytown',
      addressRegion: 'CA',
      postalCode: '94110',
      addressCountry: 'US'
    },
    geo: {
      latitude: 37.7500,
      longitude: -122.4100
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
    description: 'Specialty items and gourmet foods.',
    telephone: '+1-555-876-5432',
    url: 'https://example.com/northside',
    image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    address: {
      streetAddress: '654 Hill Street',
      addressLocality: 'Anytown',
      addressRegion: 'CA',
      postalCode: '94118',
      addressCountry: 'US'
    },
    geo: {
      latitude: 37.7850,
      longitude: -122.4500
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
