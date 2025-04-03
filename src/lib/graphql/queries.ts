
import { gql } from '@apollo/client';

// Query to fetch all stores
export const GET_ALL_STORES = gql`
  query GetAllStores {
    stores {
      id
      name
      description
      telephone
      url
      image
      address {
        streetAddress
        addressLocality
        addressRegion
        postalCode
        addressCountry
      }
      geo {
        latitude
        longitude
      }
      openingHoursSpecification {
        dayOfWeek
        opens
        closes
      }
      priceRange
      servesCuisine
      amenityFeature
      branchOf {
        name
        url
      }
    }
  }
`;

// Query to fetch a single store by ID
export const GET_STORE_BY_ID = gql`
  query GetStoreById($id: ID!) {
    store(id: $id) {
      id
      name
      description
      telephone
      url
      image
      address {
        streetAddress
        addressLocality
        addressRegion
        postalCode
        addressCountry
      }
      geo {
        latitude
        longitude
      }
      openingHoursSpecification {
        dayOfWeek
        opens
        closes
      }
      priceRange
      servesCuisine
      amenityFeature
      branchOf {
        name
        url
      }
    }
  }
`;

// Query to search stores by name or location
export const SEARCH_STORES = gql`
  query SearchStores($query: String!) {
    searchStores(query: $query) {
      id
      name
      description
      address {
        streetAddress
        addressLocality
        addressRegion
        postalCode
        addressCountry
      }
      geo {
        latitude
        longitude
      }
    }
  }
`;
