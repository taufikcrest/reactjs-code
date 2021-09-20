import React from 'react';
import MediaQuery from 'react-responsive';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { persistor, store } from 'store/configureStore';
import App from 'App';

// we need to keep the store persist on page reload( Hard reload ) that's why we have used `redux-persist` library.

export default function () {
  return (
    <Provider store={store}>
      <PersistGate loading={false} persistor={persistor}>
        {/* We want to run app in landscape view only */}
        <MediaQuery orientation="landscape">
          {(matches) => {
            if (matches) return <App />;
            return <p className="text-danger">Sorry, Application can work in landscape mode only, please rotate your device.</p>;
          }}
        </MediaQuery>
      </PersistGate>
    </Provider>
  );
}