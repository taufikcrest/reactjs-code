import { gql } from 'apollo-boost';

export const GET_CUSTOMERS_WITH_PAGINATION = gql`
  query getCustomers($id: ID, $search: String, $date: String, $from: String, $to: String, $limit: Int, $page: Int, $orderBy: String) {
    customersConnection ( customerId: $id, search: $search, date: $date, from: $from, to: $to, limit: $limit, page: $page, orderBy: $orderBy ) {
      data {
        id
        name
        first_name
        last_name
        allergies
        medications
        phone
        alt_phone
        email
        address
        zip
        city
        state
        country
        notes
        receive_emails
        receive_sms
        booking_alert
        checkin_alert
        checkout_alert
        points
        source {
          id
          name
        }
        preferred_staff {
          id
          name
        }
      }
      totalCount
      perPage
      currentPage
      hasPages
    }
  }
`

export const GET_RESOURCES_CONNECTION = gql`
  query getResourcesConnection($location: ID, $date: String, $from: String, $to: String, $search: String, $status: [String], $orderBy: String, $first: Int, $after: Int) {
    resourcesConnection(first: $first, after: $after, location: $location, search: $search, orderBy: $orderBy) {
      totalCount
      edges {
        id
        name
        tags(date: $date, from: $from, to: $to, status: $status) {
          value
          label
          records
        }
      }
      pageInfo {
        currentPage
        lastPage
        hasNextPage
      }
    }
  }
`

export const GET_PRODUCTS_WITH_PAGINATION = gql`
  query getProductsWithPagination( $locationId: ID!, $productId: ID, $categoryId: ID, $search: String, $limit: Int, $page: Int, $orderBy: String ){
    user {
      id
      locations( locationId: $locationId ) {
        id
        productsConnection( productId: $productId, categoryId: $categoryId, search: $search, limit: $limit, page: $page, orderBy: $orderBy ) {
          data {
            id
            title
            thumbnail
            quantity
            price
          }
          totalCount
          perPage
          currentPage
          hasPages
        }
      }
    }
  }
`