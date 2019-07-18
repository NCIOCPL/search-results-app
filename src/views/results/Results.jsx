import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import querystring from 'querystring';
import {
  Spinner,
  Pager,
  ResultsList,
  SearchBox,
  Dictionary,
} from '../../components';

// TEMP: Used for mocking state while doing UI dev
import { updateResults } from '../../state/store/results';
import mocks from '../../state/mocks';

// TODO: Move to utility functions
const getSearchParams = () => {
  return window.location.search;
}

// TODO: Move to utility functions and flesh oput, or remove altogether.
const validateQueryString = unvalidatedQueryString => unvalidatedQueryString;

// TODO: Placeholder for primary controller/router/instigator of API calls
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
                            <Dictionary />
                        }
                      </div>
                    )
                  })
                :
                  currentDictionary  && 
                    <Dictionary />
            }
            <div>Results x-y of z for: xxx</div>
            <ResultsList />
            <div>Results x-y of z</div>
            <Pager />
            <div>Z Results found for: xxx</div>
            <SearchBox />
          </div>
        )
      : <Spinner />
  )
}

export default Results;