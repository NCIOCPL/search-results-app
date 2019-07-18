import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './state/store/reducers';
import createEventReporterMiddleware from './state/middleware/event-reporter';
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
  // services = {
  //   search: {
  //     ?endpoint [/Search],
  //     params: {
  //       collection [cgov|doc],
  //       site [all|microsite URL],
  //       language: [en|es]
  //     }
  //   },
  //   dictionary: {
  //     ?endpoint [/Dictionary.Service/v1/search],
  //     params: {
  //       dictionary: [term] equivalent to collection,
  //       language: [English|Spanish]
  //       searchType: "exact",
  //     }
  //   },
  //   bestBets: {
  //     ?endpoint [],
  //     params: {
  //       language: [en|es],
  //       collection [live|preview],
  //     }
  //   }
  // }
  // language,
} = {}) => {
  // TODO: Sessionstorage loading.
  const cachedState = undefined;

  // Set up middlewares.
  const eventReporterMiddleware = createEventReporterMiddleware(eventHandler);

  const history = createBrowserHistory();
  const historyMiddleware = createHistoryMiddleware(history);

  const store = createStore(
    combineReducers(reducers),
    cachedState,
    composeWithDevTools(
      applyMiddleware(
        metadataMiddleWare,
        cacheMiddleware,
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
  initialize();
}

export default initialize;
