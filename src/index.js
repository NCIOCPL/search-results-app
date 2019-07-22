import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './state/store/reducers';
import createEventReporterMiddleware from './state/middleware/event-reporter';
import createApiMiddleware from './state/middleware/api';
import metadataMiddleWare from './state/middleware/metadata';
import cacheMiddleware from './state/middleware/cache';
import { createBrowserHistory } from 'history';
import createHistoryMiddleware from './state/middleware/history';
import NavigationHandler from './components/navigation-handler';
import Results from './views/results';
import './index.css';

const initialize = ({
  // appId = '@@/DEFAULT_APP_ID',
  // useSessionStorage = true,
  rootId = 'NCI-search-results-root',
  eventHandler,
  // By passing in the API services as both configuration objects and a url generator (controller) we
  // can move most of the custom processing into the bridge code for easier adjustment per site based on
  // changing requirements.
  services = {},
  // language,
} = {}) => {
  // TODO: Sessionstorage loading.
  const cachedState = undefined;

  // Set up middlewares.
  const eventReporterMiddleware = createEventReporterMiddleware(eventHandler);

  const apiMiddleware = createApiMiddleware(services);

  const history = createBrowserHistory();
  const historyMiddleware = createHistoryMiddleware(history);

  const store = createStore(
    combineReducers(reducers),
    cachedState,
    composeWithDevTools(
      applyMiddleware(
        metadataMiddleWare,
        cacheMiddleware,
        apiMiddleware,
        historyMiddleware,
        eventReporterMiddleware,
      )
    )
  );

  const App = () => {
    return (
      <Provider store={store}>
        <NavigationHandler>
          <Results />
        </NavigationHandler>
      </Provider>
    );
  };

  ReactDOM.render(<App />, document.getElementById(rootId));
};

if (process.env.NODE_ENV !== 'production') {
  const rootId = 'NCI-search-results-root';
  const eventHandler = () => {};
  const search = searchConfig => {
    const baseEndpoint = 'https://webapis.cancer.gov/sitewidesearch/v1/Search/cgov/en/';
    const endpoint = baseEndpoint + searchConfig.queryString;
    return endpoint;
  }
  const dictionary = searchConfig => {
    const baseEndpoint = 'https://www.cancer.gov/Dictionary.Service/v1/search?dictionary=term&language=English&searchType=exact&offset=0&maxResuts=0';
    const searchText = encodeURI(searchConfig.term);
    const endpoint = `${ baseEndpoint }&searchText=${ searchText }`;
    return endpoint;
  }
  const bestBets = searchConfig => {
    const baseEndpoint = 'https://webapis.cancer.gov/bestbets/v1/BestBets/live/en/';
    const searchText = encodeURI(searchConfig.term);
    const endpoint = baseEndpoint + searchText;
    return endpoint;
  }
  initialize({
    rootId,
    eventHandler,
    services: {
      search,
      dictionary,
      bestBets,
    },
  });
}

export default initialize;
