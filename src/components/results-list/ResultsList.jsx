import React from 'react';
import ResultsListItem from './results-list-item';
import './ResultsList.css';

const ResultsList = ({ results }) => {
  return (
    <ul className="no-bullets results-list__container">
      {
        results.map((result, index) =>  <ResultsListItem key={ index } { ...result } />)
      }
    </ul>
  )
}

export default ResultsList;