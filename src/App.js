import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

// Reapop ( react-notification-system ) with customized theme.
import NotificationsSystem from 'components/NotificationsSystem';

// Pages.
const Application = React.lazy(() => import('./pages/Application'));

// render Login / Application's Dashboard, We can do it in both way using route (react-router) / conditional rendering, I have done using condition.

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Suspense fallback={<>Loading...</>}>
          <Application />
        </Suspense>
        <NotificationsSystem />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  token: get(state, 'oauth.token')
});

export default connect(mapStateToProps)(App);
