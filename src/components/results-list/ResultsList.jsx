import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResultsListItem from './results-list-item';
import './ResultsList.css';

const ResultsList = ({ results }) => {

  // #### Event for external listener that acts as a page load event
  const dispatch = useDispatch();
  const cacheKeyForSearchInfo = useSelector(store => store.results.search);
  const { totalResults } = useSelector(store => store.cache.search[cacheKeyForSearchInfo]);
  useEffect(() => {
    dispatch({
      type: '@@event/results_load',
      payload: {
        totalResults,
      },
    })
  // Use the cachekey to memoize to avoid multiple calls during the rendering of results throughout
  // the cahce/api retrieval pipeline. Essentially, this means we only emit this event once per page load
  // when the new results count is available.
  }, [cacheKeyForSearchInfo])
  // #### End event.

  return (
    <ul className="no-bullets results-list__container">
      {
        results.map((result, index) =>  <ResultsListItem key={ index } resultIndex={ index } { ...result } />)
      }
    </ul>
  )
}

export default ResultsList;