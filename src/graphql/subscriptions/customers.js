import { gql } from 'apollo-boost';

export const CUSTOMERS_SUBSCRIPTIONS = gql`
  subscription {
    customer {
      id
      name
      # ... all properties of customer for which you want to listen ( frequently updating ).
    }
  }
`