import { gql } from 'apollo-boost';

export const DELETE_CUSTOMER = gql`
  mutation deleteCustomer( $id: Int! ) {
    deleteCustomer( id: $id ) {
      id
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation createCustomer(
    $source: ID, 
    $first_name: String!, 
    $last_name: String!, 
    $allergies: Boolean!, 
    $medications: Boolean!, 
    $phone: String!, 
    $alt_phone: String, 
    $email: String!, 
    $street1: String!, 
    $street2: String, 
    $zip: String!, 
    $city: String!, 
    $state: String!, 
    $country: String!, 
    $preferred_staff: ID, 
    $notes: String,
    $receive_emails: Boolean,
    $receive_sms: Boolean,
    $booking_alert: String,
    $checkin_alert: String,
    $checkout_alert: String
  ) {
    createCustomer( 
      source: $source,
      first_name: $first_name,
      last_name: $last_name,
      allergies: $allergies,
      medications: $medications,
      phone: $phone,
      alt_phone: $alt_phone,
      email: $email,
      street1: $street1,
      street2: $street2,
      zip: $zip,
      city: $city,
      state: $state,
      country: $country,
      preferred_staff: $preferred_staff,
      notes: $notes,
      receive_emails: $receive_emails,
      receive_sms: $receive_sms,
      booking_alert: $booking_alert,
      checkin_alert: $checkin_alert,
      checkout_alert: $checkout_alert
    ) {
      id
      first_name
      last_name
      name
      allergies
      medications
      phone
      alt_phone
      email
      address
      street1
      street2
      zip
      city
      state
      country
      notes
      source_information
      receive_emails
      receive_sms
      booking_alert
      checkin_alert
      checkout_alert
      preferred_staff {
        id,
        name
      }
      source {
        id
        name
      }
    }
  }
`;