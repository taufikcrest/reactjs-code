import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';

// importing css file generated through `node-sass`.
import './styles/css/main.css';

const rootEl = document.getElementById('root')

ReactDOM.render(
  <Root />,
  rootEl
);

// hot reloading.
if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextApp = require('./Root').default;
    ReactDOM.render(
      <NextApp />,
      rootEl
    )
  })
}

// Note: comments in files are for better understanding only.