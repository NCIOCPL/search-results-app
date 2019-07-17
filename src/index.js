import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const initialize = (
  // appId = '@@/DEFAULT_APP_ID',
  // useSessionStorage = true,
  // rootId = 'r4r-root',
  // eventHandler,
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
) => {

  const App = () => {
    return <div>Search Results App</div>;
  }

  ReactDOM.render(<App />, document.getElementById('NCI-search-results-root'));
}

if(process.env.NODE_ENV !== 'production') {
  initialize();
}

export default initialize;