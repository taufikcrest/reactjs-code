import ApolloClient from 'apollo-boost';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

// redux store.
import store from 'store/configureStore';

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql'
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080',
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);


// setup the apollo-client.
export const client = new ApolloClient({
  link,
  request: (operation) => {
    // redux store's state.
    const state = store.getState();

    // getting information from store.
    const { oauth: { uri, token: { token_type, access_token } } } = state || {};

    operation.setContext({
      headers: {
        'Authorization': `${token_type} ${access_token}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      uri: `${uri}/graphql`,
    });
  }
});