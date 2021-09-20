import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';

import rootReducer from 'reducers';
import config from 'helpers/config';

const persistConfig = {
  key: config.store_name,
  storage: storage
};

let middleware;

// loading required middlewares depending upon the environment
if (process.env.NODE_ENV === 'production') {

  middleware = applyMiddleware(
    thunk,  // applying thunk middleware for distatching action based upon conditions.
  );

} else {
  // Redux Devtools helps us in debugging redux store better. it provide feaatures like time-travel, view store data etc.
  middleware = composeWithDevTools(
    applyMiddleware(
      thunk,
    )
  );

}

const pReducer = persistReducer(persistConfig, rootReducer);

// creating the main/central store
export const store = createStore(
  pReducer,
  middleware
);

export const persistor = persistStore(store);

export default store;

// Here, we can export a function too, in order to pass predefined state while creating store before registering it to `Provider`.