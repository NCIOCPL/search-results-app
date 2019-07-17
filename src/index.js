import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './state/store/reducers';
import createEventReporterMiddleware from './state/middleware/event-reporter';
import NavigationHandler from './components/navigation-handler';
import Results from './views/results';
import './index.css';

const initialize = ({
  // appId = '@@/DEFAULT_APP_ID',
  // useSessionStorage = true,
  // rootId = 'r4r-root',
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

  const store = createStore(
    combineReducers(reducers),
    cachedState,
    composeWithDevTools(
      applyMiddleware(
        eventReporterMiddleware,
      )
    )
  )

  const App = () => {
    return (
      <Provider store={ store }>
        <NavigationHandler>
          <Results />
        </NavigationHandler>
      </Provider>
    );
  }

  ReactDOM.render(<App />, document.getElementById('NCI-search-results-root'));
}

if(process.env.NODE_ENV !== 'production') {
  initialize();
}

export default initialize;