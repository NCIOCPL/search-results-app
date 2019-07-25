import 'react-app-polyfill/ie11';
import './polyfills/array_fill';
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
import ErrorBoundary from './components/error-boundary';
import Results from './views/results';
import { loadStateFromSessionStorage, saveStatetoSessionStorage } from './utilities';
import './index.css';

const initialize = ({
  appId = '@@/DEFAULT_SWS_APP_ID',
  useSessionStorage = true,
  rootId = 'NCI-search-results-root',
  eventHandler,
  // By passing in the API services as both configuration objects and a url generator (controller) we
  // can move most of the custom processing into the bridge code for easier adjustment per site based on
  // changing requirements.
  // In addition, if you don't want a specific instance of the app to use a service, such as dictionary or bestbets
  // on microsites, you simply don't pass a service in. The API middleware will only execute an API call if a service
  // was passed in here according to that specific service type (search|dictionary|bestBets).
  services = {},
  // NOTE: To access translations, first take the language from the store and then
  // use the translate utility function (which is composed with that map of translations).
  // To add translations, edit the translations.config.js file.
  language = 'en',
  dropdownOptions = [ 20, 50 ],
} = {}) => {
  let cachedState;
  if(process.env.NODE_ENV !== 'development' && useSessionStorage === true) {
      cachedState = loadStateFromSessionStorage(appId);
  }

  // Set up middleware chain for redux dispatch.
  const history = createBrowserHistory();
  const historyMiddleware = createHistoryMiddleware(history);
  const eventReporterMiddleware = createEventReporterMiddleware(eventHandler);
  const apiMiddleware = createApiMiddleware(services);

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
  
  // Here we are going to use the store as nothing more than a piece
  // of global configuration state to read from.

  store.dispatch({
    type: '@@globals/load_values',
    payload: {
      language,
      dropdownOptions,
    }
  })

  store.dispatch({
    type: '@@router/update_location',
    payload: history.location.search,
  })
  
  // The history library acts as our API between us and the browser's History API.
  // We want any changes to the browser location to be used to rerender the page.
  history.listen(location  => {
    const url = location.search;
    store.dispatch({
      type: '@@router/update_location',
      payload: url,
    })
  })

  // With the store now created, we want to subscribe to updates.
  // This implementation updates session storage backup on each store change.
  // If for some reason that proves too heavy, it's simple enough to scope to
  // only specific changes (like the url);
  if(process.env.NODE_ENV !== 'development' && useSessionStorage === true) {
    const saveDesiredStateToSessionStorage = () => {
        const allState = store.getState();
        // No need to store error or translation map to session storage
        const { error, globals, ...state } = allState;
        saveStatetoSessionStorage({
            state,
            appId,
        });
    };

    store.subscribe(saveDesiredStateToSessionStorage);
  }


  const App = () => {
    return (
      <Provider store={ store }>
        <ErrorBoundary dispatch={ store.dispatch }>
          <NavigationHandler>
            <Results language={ language } />
          </NavigationHandler>
        </ErrorBoundary>
      </Provider>
    );
  };

  ReactDOM.render(<App />, document.getElementById(rootId));
};

// The following lets us run the app in dev not in situ as would normally be the case.
if (process.env.NODE_ENV !== 'production') {
  try{
    import('./__nci-dev__common.css');
  }
  catch(err){
    console.log("Can't find common.css file")
  }
  const rootId = 'NCI-search-results-root';
  const eventHandler = () => {};
  const search = urlOptionsMap => {
    const baseEndpoint = 'https://webapis.cancer.gov/sitewidesearch/v1/Search/cgov/en/';
    const endpoint = baseEndpoint + urlOptionsMap.queryString;
    return endpoint;
  }
  const dictionary = urlOptionsMap => {
    const baseEndpoint = 'https://www.cancer.gov/Dictionary.Service/v1/search?dictionary=term&language=English&searchType=exact&offset=0&maxResuts=0';
    const searchText = encodeURI(urlOptionsMap.term);
    const endpoint = `${ baseEndpoint }&searchText=${ searchText }`;
    return endpoint;
  }
  const bestBets = urlOptionsMap => {
    const baseEndpoint = 'https://webapis.cancer.gov/bestbets/v1/BestBets/live/en/';
    const searchText = encodeURI(urlOptionsMap.term);
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
