import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

// `GraphQL` client for making the api calls.
import { client } from 'graphql/client';

// Pages
const Dashboard = React.lazy(() => import('./Dashboard'));
const Site = React.lazy(() => import('./Site'));

export default function () {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<>Loading...</>}>
        <Router>
          <Switch>
            <Route path="/:siteId([0-9]+)" component={Site} />
            <Route component={Dashboard} />
          </Switch>
        </Router>
      </Suspense>
    </ApolloProvider>
  )
}