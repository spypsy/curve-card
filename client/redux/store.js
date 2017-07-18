import * as storage from 'redux-storage';
import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';

import createEngine from 'redux-storage-engine-localstorage';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import optimistPromiseMiddleware from 'redux-optimist-promise';
import objectToPromise from 'redux-object-to-promise';
import debounceDecorator from 'redux-storage-decorator-debounce';
import { save, load } from 'redux-localstorage-simple';
import { routerMiddleware } from 'react-router-redux';

import config from '../../common/config';
import { APP } from '../../common/globals';
import redirector from './middleware/redirect';
import reducer from './reducers';

// create hash history without query key
const hashHistory = useRouterHistory(createHashHistory)({ queryKey: false });

// combine reducers into one
const storageReducer = storage.reducer(reducer);

// create storage engine wrapping reducers
let engine = createEngine(APP.store.name);
engine = debounceDecorator(engine, 1000);
// const myDucks = ['jobs'];
// engine = filterDecorator(engine, myDucks);

const storageMiddleware = storage.createMiddleware(engine);
const reduxRouterMiddleware = routerMiddleware(hashHistory);

const logger = createLogger({ collapsed: true });
// debugger;
const middlewares = [
  reduxRouterMiddleware,
  save({ namespace: APP.store.name }),
  redirector,
  logger,
  storageMiddleware,
  objectToPromise({ baseURL: config.api, timeout: 10000 }, { key: 'gq_token' }),
  optimistPromiseMiddleware(),
];

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const store = createStoreWithMiddleware(
  storageReducer,
  load({ namespace: APP.store.name })
);
export const history = hashHistory;

// exports

export const loadFromStorage = _store => storage.createLoader(engine)(_store);

export default store;
