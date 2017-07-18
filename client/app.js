import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import store, { loadFromStorage, history } from './redux/store';

const hist = syncHistoryWithStore(history, store);
const node = document.getElementById('app');

function loadReact() {
  ReactDOM.unmountComponentAtNode(node); // clean waiting screen

  ReactDOM.render(
    <Provider store={store}>
      <Router history={hist}>
        {routes}
      </Router>
    </Provider>,
    node
  );
}

loadFromStorage(store)
  .then(() => {
    loadReact();
  })
  .catch(err => {
    console.error(err || new Error('Failed to load previous state'));
    loadReact(); // load React anyway
  });
