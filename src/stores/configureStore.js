import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
// import thunk from 'redux-thunk';
import {browserHistory} from 'react-router';
import {createEpicMiddleware} from 'redux-observable';
import {routerMiddleware} from 'react-router-redux';
import {rootEpic} from '../indexEpic';
import rootReducer from '../reducers/index';

const logger = createLogger();
const router = routerMiddleware(browserHistory);
// const createStoreWithMiddleware = applyMiddleware(thunk, router, logger)(createStore);

const epicMiddleware = createEpicMiddleware(rootEpic);
const createStoreWithMiddleware = applyMiddleware(epicMiddleware, router)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
