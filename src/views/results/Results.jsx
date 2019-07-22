import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Spinner,
  Pager,
  ResultsList,
  SearchBox,
  FeatureBox,
} from '../../components';
import { initiateAPICalls } from '../../state/store/actions';
import { parseURL } from '../../utilities';
import { useCurrentSearchResults } from '../../utilities/hooks';
import './Results.css';

// TEMP: Used for mocking state while doing UI dev
import mocks from '../../state/mocks';

// TODO: Move to utility functions
const getURL = () => {
  return mocks["tumor"].searchParams // window.location.search;
}

const Results = () => {
  const dispatch = useDispatch();
  // The view will be rendered entirely by state derived from the URL. Both immediately and
  // asynchronously as a result of API calls initiated by the URL search params. To that end
  // we want to listen primarily for changes to the URL so we can start the process of deriving
  // and collecting that state.

  // 1. Grab current search param string:
  // We do this outside of the hook so that the hook is reactive only to changes in the querystring (we don't want
  // to make API calls unnecessarily when the searchparams haven't changed on rerenders)
  const url = useSelector(store => store.router.location);
  const urlOptionsMap = parseURL(url);

  // Final. Kick off API calls based on new search params.
  // Note: We want to use the url string as the value to memoize based on.
  // Using the deconstructed object means unnecessary calls because the object
  // is new on each render.
  // N.B. The useEffect hook will in fact run after everything else in this function (it is always guaranteed
  // to run after the DOM has been rewritten). We declare it here because we want certain variables to accessible
  // in its closure.
  useEffect(() => {
    initiateAPICalls(dispatch)(urlOptionsMap);
  }, [dispatch, url])

  // 2. Get current results from cache.
  const currentSearch = useCurrentSearchResults();

  // 3a. Set up parameters for rendering pagers/counters.
  const {
    term,
    page,
    pageunit,
    Offset: offset,
  } = urlOptionsMap;

  // 3b. Calculate the numbers used for the results info displays.
  const resultsStart = 1 + offset;
  // If we are on the last page of results, the range might be less than the offset
  // This breaks if we don't have a current search (total) yet so we delay the calculation by wrapping it in a function call or component...
  const getResultsEnd = (step, total) => step <= total ? step : total;
  
  return(
    currentSearch
      ? (
          <div>
            <p className="results__info-label">Results for: { term }</p>
            <FeatureBox bestBetsIsVisible={ page === 1 } />
            <p className="results__info-label">Results {`${ resultsStart }-${ getResultsEnd(offset + pageunit, currentSearch.totalResults) }`} of { currentSearch.totalResults } for: { term }</p>
            <ResultsList { ...currentSearch } />
            <p className="results__info-label">Results {`${ resultsStart }-${ getResultsEnd(offset + pageunit, currentSearch.totalResults) }`} of { currentSearch.totalResults }</p>
            <Pager 
              page={ page }
              pageSize={ pageunit }
              start={ resultsStart }
              end={ getResultsEnd(offset + pageunit, currentSearch.totalResults) }
              totalResults={ currentSearch.totalResults }
            />
            <p className="results__info-label">{ currentSearch.totalResults } Results found for: { term }</p>
            <SearchBox />
          </div>
        )
      : <Spinner />
  )
}

export default Results;