import { combineReducers } from 'redux';
import optimist from 'redux-optimist';
import { routerReducer as routing } from 'react-router-redux';

import cards from './ducks/cards';
import merchant from './ducks/merchant';

export default optimist(
  combineReducers({
    routing,
    cards,
    merchant,
  })
);
