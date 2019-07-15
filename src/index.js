import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const initialize = () => {

  const App = () => {
    return <div>Search Results App</div>;
  }

  ReactDOM.render(<App />, document.getElementById('NCI-search-results-root'));
}

if(process.env.NODE_ENV !== 'production') {
  initialize();
}

export default initialize;