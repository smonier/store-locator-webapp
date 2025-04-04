
import { gql } from '@apollo/client';

// Query to fetch all stores
export const GET_ALL_STORES = gql`
  query GetStores($language: String!) {
    jcr (workspace: LIVE) {
      nodesByCriteria(criteria: {nodeType: "slocnt:store"}) {
        nodes {
          uuid
          displayName(language: $language)
          name: property(name: "name",language: $language) {
            value
          }
          description: property(name: "description",language: $language) {
            value

          }
          image: property(name: "image") {

            node: refNode {
              url
            }

          }
          telephone: property(name: "telephone",language: $language) {
            value

          }
          priceRange: property(name: "priceRange",language: $language) {
            value

          }
          amenityFeature: property(name: "amenityFeature",language: $language) {
            values

          }
          openingHours: property(name: "openingHours",language: $language) {
            values

          }
          latitude: property(name: "latitude",language: $language) {
            value

          }
          longitude: property(name: "longitude",language: $language) {
            value

          }
          streetAddress: property(name: "streetAddress",language: $language) {
            value

          }
          addressLocality: property(name: "addressLocality",language: $language) {
            value

          }
          addressRegion: property(name: "addressRegion",language: $language) {
            value

          }
          postalCode: property(name: "postalCode",language: $language) {
            value

          }
          addressCountry: property(name: "addressCountry",language: $language) {
            value

          }
          url: property(name: "url",language: $language) {
            value
          }
        }
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
