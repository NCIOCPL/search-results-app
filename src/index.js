import 'react-app-polyfill/ie11';
import './polyfills/array_fill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './state/store/reducers';
import createApiMiddleware from './state/middleware/api';
import metadataMiddleWare from './state/middleware/metadata';
import cacheMiddleware from './state/middleware/cache';
import { createBrowserHistory } from 'history';
import createHistoryMiddleware from './state/middleware/history';
import NavigationHandler from './components/navigation-handler';
import ErrorBoundary from './components/error-boundary';
import { AnalyticsProvider, EddlAnalyticsProvider } from './tracking';
import Results from './views/results';
import { loadStateFromSessionStorage, saveStatetoSessionStorage } from './utilities';
import * as serviceWorker from "./serviceWorker";
import './index.css';

/**
 * Initialize the Sitewide Search App
 *
 * @param {object} params The configuration options
 * @param {string} params.appId The application ID
 * @param {boolean} params.useSessionStorage Use session storage for caching. (Default: true)
 * @param {string} params.rootId The app root element ID to insert the app at. (Default: 'NCI-app-root')
 * @param {string|Function} params.analyticsHandler A function for analytics handling, or the string EddlAnalyticsHandler to use the EddlAnalyticsProvider. (Default: 'EddlAnalyticsProvider')
 * @param {string} params.searchEndpoint The sitewide search API endpoint. (Default: 'https://webapis.cancer.gov/sitewidesearch/v1/')
 * @param {string} params.bestbetsEndpoint The bestbests API endpoint. Set false to remove best bets from results. (Default: 'https://webapis.cancer.gov/bestbets/v1/')
 * @param {string} params.dictionaryEndpoint The dictionary API endpoint. Set false to remove definition from results. (Default: 'https://webapis.cancer.gov/glossary/v1/')
 * @param {string} params.language The language of the app. (Default: 'en')
 * @param {array} params.dropdownOptions The choice for the number of results to show. (Default: [20, 50])
 */
const initialize = ({
  appId = '@@/DEFAULT_SWS_APP_ID',
  useSessionStorage = true,
  rootId = 'NCI-app-root',
  analyticsHandler = "EddlAnalyticsHandler",
  title = 'NCI Search Results',
  searchEndpoint = 'https://webapis.cancer.gov/sitewidesearch/v1/',
  searchCollection = 'cgov',
  searchSiteFilter = 'all',
  bestbetsEndpoint = 'https://webapis.cancer.gov/bestbets/v1/',
  bestbetsCollection = 'live',
  dictionaryEndpoint = 'https://webapis.cancer.gov/glossary/v1/',
  dictionaryName = 'Cancer.gov',
  dictionaryAudience = 'Patient',

  // NOTE: To access translations, first take the language from the store and then
  // use the translate utility function (which is composed with that map of translations).
  // To add translations, edit the translations.config.js file.
  language = 'en',
  dropdownOptions = [ 20, 50 ],
} = {}) => {

  // Making this backwards compatible with the code for now. We should not be passing in
  // functions that transform the request urls, since the app expects the response to
  // match that specific version of the API. We should move to react-fetching and just
  // define the endpoints there.
  const services = {
    search: ({
      term = "",
      size = 0,
      from = 0
    }={}) => {
      return `${searchEndpoint}Search/${searchCollection}/${language}/${encodeURI(term)}?from=${from}&size=${size}&site=${searchSiteFilter}`;
    },
    dictionary: dictionaryEndpoint ? ({
      term = ""
    }={}) => {
      return `${dictionaryEndpoint}Terms/search/${dictionaryName}/${dictionaryAudience}/${language}/${encodeURI(term)}?size=1`;
    } : undefined,
    bestBets: bestbetsEndpoint ? ({
      term = ""
    }={}) => {
      return `${bestbetsEndpoint}BestBets/${bestbetsCollection}/${language}/${encodeURI(term)}`;
    } : undefined
  };

  let cachedState;
  if(process.env.NODE_ENV !== 'development' && useSessionStorage === true) {
      cachedState = loadStateFromSessionStorage(appId);
  }

  // Set up middleware chain for redux dispatch.
  const history = createBrowserHistory();
  const historyMiddleware = createHistoryMiddleware(history);
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

  const appRootDOMNode = document.getElementById(rootId);

  // Determine the analytics HoC we are going to use.
  // The following allows the app to be more portable, cgov will
  // default to using EDDL Analytics. Other sites could supplier
  // their own custom handler.
  const AnalyticsHoC = ({children}) => 
    analyticsHandler === 'EddlAnalyticsHandler' ? 
      ( 
        <EddlAnalyticsProvider
          pageLanguage={language === 'es' ? 'spanish' : 'english'}
          // App Has no Audience
          //pageChannel={analyticsChannel}
          //pageContentGroup={dictionaryTitle}
          //publishedDate={analyticsPublishedDate}
        > {children} </EddlAnalyticsProvider>
      ) :
      ( <AnalyticsProvider
          analyticsHandler={analyticsHandler}
        >{children}</AnalyticsProvider>);

  const App = () => {
    return (
      <Provider store={ store }>
        <AnalyticsHoC>
          <ErrorBoundary dispatch={ store.dispatch }>
            <NavigationHandler>
              <Results title={ title } language={ language } />
            </NavigationHandler>
          </ErrorBoundary>
        </AnalyticsHoC>
      </Provider>
    );
  };

  ReactDOM.render(<App />, appRootDOMNode);
  return appRootDOMNode;
};

export default initialize;

// The following lets us run the app in dev not in situ as would normally be the case.
const appParams = window.APP_PARAMS || {};
const integrationTestOverrides = window.INT_TEST_APP_PARAMS || {};

if (process.env.NODE_ENV !== 'production') {

  // This is DEV.
  const settings = {
    ...appParams,
    ...integrationTestOverrides
  };

  initialize(settings);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();