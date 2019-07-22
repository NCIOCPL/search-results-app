import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Spinner,
  Pager,
  ResultsList,
  SearchBox,
  FeatureBox,
} from '../../components';
import { initiateSearchAction } from '../../state/store/actions';
import {
  parseSearchParams,
} from '../../utilities';
import './Results.css';

// TEMP: Used for mocking state while doing UI dev
import { updateResults } from '../../state/store/results';
import mocks from '../../state/mocks';

// TODO: Move to utility functions
const getSearchParams = () => {
  return mocks["tumor"].searchParams // window.location.search;
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
  const searchParamsString = getSearchParams();
  const searchParams = parseSearchParams(searchParamsString);

  // We want to use the string as the value to memoize based on.
  // Using the deconstructed object means unnecessary calls because the object
  // is new on each render.
  useEffect(() => {
    const {
      swKeyword,
      ...params
    } = searchParams;
    // Fire off API calls
    initiateSearchAction(dispatch)({
      term: swKeyword,
      params
    });
  }, [dispatch, searchParamsString])

  // We need to reconstitute from the cache. 
  const cache = useSelector(store => store.cache);
  
  // RESTORE CURRENT SEARCH RESULTS FROM CACHE
  // TODO: Parse, format, process, normalize selected state using utility helpers as much as possible
  // TODO: All reconstitutions should be abstracted into helpers that take a snapshot of the cache
  // and return the appropriate reconsituted resource.
  const currentSearchCacheKey = useSelector(store => store.results.search);
  const retrievedCachedSearch = (cache, cacheKey) => {
    if(!cacheKey){
      return null;
    }
    const normalizedSearch = cache.search[cacheKey];
    const restoredSearch = {
      ...normalizedSearch,
      results: normalizedSearch.results.map(resultItemCacheKey => cache.resultItems[resultItemCacheKey]),
    }
    return restoredSearch;
  }
  const currentSearch = retrievedCachedSearch(cache, currentSearchCacheKey);

  // ######### TEMP FOR DEV ###########
  useEffect(() =>  {
    // TODO: Update mocks to match normalized search. This mock is no longer a valid shape.
    // dispatch(updateResults('search', mocks["tumor"].search));
    // dispatch(updateResults('bestBets', mocks["tumor"].bestBets));
    // dispatch(updateResults('dictionary', mocks["tumor"].dictionary));
  }, [dispatch])
  // ##################################

  const {
    swKeyword: searchTerm,
    page,
    pageunit,
    Offset: offset,
  } = searchParams;

  // Calculate the numbers used for the results info displays.
  const resultsStart = 1 + offset;
  // If we are on the last page of results, the range might be less than the offset
  // This breaks if we don't have a current search (total) yet so we delay the calculation by wrapping it in a function call or component...
  const getResultsEnd = (step, total) => step <= total ? step : total;
  
  return(
    currentSearch
      ? (
          <div>
            <p className="results__info-label">Results for: { searchTerm }</p>
            <FeatureBox bestBetsIsVisible={ page === 1 } />
            <p className="results__info-label">Results {`${ resultsStart }-${ getResultsEnd(offset + pageunit, currentSearch.totalResults) }`} of { currentSearch.totalResults } for: { searchTerm }</p>
            <ResultsList { ...currentSearch } />
            <p className="results__info-label">Results {`${ resultsStart }-${ getResultsEnd(offset + pageunit, currentSearch.totalResults) }`} of { currentSearch.totalResults }</p>
            <Pager 
              page={ page }
              pageSize={ pageunit }
              start={ resultsStart }
              end={ getResultsEnd(offset + pageunit, currentSearch.totalResults) }
              totalResults={ currentSearch.totalResults }
            />
            <p className="results__info-label">{ currentSearch.totalResults } Results found for: { searchTerm }</p>
            <SearchBox />
          </div>
        )
      : <Spinner />
  )
}

export default Results;