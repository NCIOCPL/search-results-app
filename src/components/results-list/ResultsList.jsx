import React from 'react';
import ResultsListItem from './results-list-item';

const ResultsList = ({ results }) => {
  return (
    <ul className="no-bullets">
      {
        results.map((result, index) =>  <ResultsListItem key={ index } { ...result } />)
      }
    </ul>
  )
}

export default ResultsList;