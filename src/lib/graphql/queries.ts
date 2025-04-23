
import { gql } from '@apollo/client';

// Query to fetch all stores
export const GET_ALL_STORES = gql`
  query GetStores($workspace: Workspace!, $language: String!, $path: String!) {
    jcr(workspace: $workspace) {
      nodesByCriteria(criteria: {nodeType: "slocnt:store", paths: [$path]}) {
        nodes {
          uuid
          displayName(language: $language)
          name: property(name: "name", language: $language) {
            value
          }
          description: property(name: "description", language: $language) {
            value
          }
          image: property(name: "image") {
            node: refNode {
              url
            }
          }
          telephone: property(name: "telephone", language: $language) {
            value
          }
          priceRange: property(name: "priceRange", language: $language) {
            value
          }
          amenityFeature: property(name: "amenityFeature", language: $language) {
            values
          }
          openingHours: property(name: "openingHours", language: $language) {
            values
          }
          latitude: property(name: "latitude", language: $language) {
            value
          }
          longitude: property(name: "longitude", language: $language) {
            value
          }
          streetAddress: property(name: "streetAddress", language: $language) {
            value
          }
          addressLocality: property(name: "addressLocality", language: $language) {
            value
          }
          addressRegion: property(name: "addressRegion", language: $language) {
            value
          }
          postalCode: property(name: "postalCode", language: $language) {
            value
          }
          addressCountry: property(name: "addressCountry", language: $language) {
            value
          }
          url: property(name: "url", language: $language) {
            value
          }
        }
      }
    }
  }
`;
