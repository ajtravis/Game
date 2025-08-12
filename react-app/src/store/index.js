import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session';
import tilesReducer from './tile';
import mapReducer from './map';
import enemyReducer from './enemy';
import baseReducer from './base';
import towerReducer from './tower';
import gameReducer from './game';

const rootReducer = combineReducers({
  session,
  tiles: tilesReducer,
  map: mapReducer,
  enemies: enemyReducer,
  base: baseReducer,
  towers: towerReducer,
  game: gameReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  const store = createStore(rootReducer, preloadedState, enhancer);
  // Make store globally available for enemy reward system
  window.store = store;
  return store;
};

export default configureStore;
