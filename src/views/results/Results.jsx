import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { callAllTheAPIS } from './state/stuff/actions';
import querystring from 'querystring';

import { updateResults } from '../../state/store/results';
import mocks from '../../state/mocks';

const getSearchParams = () => {
  return window.location.search;
}

const validateQueryString = unvalidatedQueryString => unvalidatedQueryString;

const callAllTheAPIs = (queryString) => {
  const parsedQueryString = querystring.parse(queryString);    
  // Validate query string through helper
  const validatedQueryString = validateQueryString(parsedQueryString);
  return { type: 'placeholder' }
}

const Results = () => {
  const dispatch = useDispatch();
  // The view will be rendered entirely by state derived from the URL. Both immediately and
  // asynchronously as a result of API calls initiated by the URL search params. To that end
  // we want to listen primarily for changes to the URL so we can start the process of deriving
  // and collecting that state.

  // Grab query string:
  // We do this outside of the hook so that the hook is reactive only to changes in the querystring (we don't want
  // to make API calls unnecessarily when the searchparams haven't changed on rerenders)
  const queryString = getSearchParams();
  useEffect(() => {
    // Fire off API calls
    dispatch(callAllTheAPIs(queryString));
  }, [dispatch, queryString])

  // TEMP FOR DEV
  useEffect(() =>  {
    dispatch(updateResults('search', mocks["tumor"].search));
    dispatch(updateResults('bestBets', mocks["tumor"].bestBets));
    dispatch(updateResults('dictionary', mocks["tumor"].dictionary));
  }, [dispatch])
  // Read store state
  //    Select editor state:
  //      Select current results
  const currentSearch = useSelector(store => store.results.search);
  //      Select current bestbets
  const currentBestBets = useSelector(store => store.results.bestBets);
  //      Select current dictionary
  const currentDictionary = useSelector(store => store.results.dictionary);

  // TODO: Remove hard coded. Derive from searchParams
  const currentPage = 1;

  // Parse, format, process, normalize selected state using utility helpers as much as possible
  
  // Render outline
  //    If store has current results for search - display
  //          If is first page of search results
  //             If a store has current best bets - display best bets
  //                If store has current dictionary - display dictionary
  //          else If store has current dictionary - display dictionary
  //    else SPINNER!!
  return(
    currentSearch
      ? (
          <div>
            <p>Results for: xxx</p>
            {
              // This won't work. We'll need to track whether we are still fetching bestBets.
              // Cases where the page is 1 but best bets hasn't returned yet will render the dictionary
              // and potentially pop in the best bets later.
              (currentPage === 1 && currentBestBets) 
                ? 
                  currentBestBets.map((bestBet, bestBetIndex) => {
                    return (
                      <div>
                        <div>Best Bet</div>
                        {
                          (bestBetIndex === 0 && currentDictionary) &&
                            (
                              <div>
                                Dictionary
                              </div>
                            )
                        }
                      </div>
                    )
                  })
                :
                  currentDictionary 
                    && (
                      <div>
                        Dictionary
                      </div>
                    )
            }
            <div>Results x-y of z for: xxx</div>
            <div>RESULTS LIST</div>
            <div>Results x-y of z</div>
            <div>Pager</div>
            <div>Z Results found for: xxx</div>
            <div>Search Box</div>
          </div>
        )
      : <div>Spinner</div>
  )
}

export default Results;