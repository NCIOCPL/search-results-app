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
import { translate } from '../../utilities/translation';
import { useCurrentSearchResults } from '../../utilities/hooks';
import './Results.css';

// TEMP: Used for mocking state while doing UI dev
import mocks from '../../state/mocks';

// TODO: Move to utility functions
const getURL = () => {
  return mocks["tumor"].searchParams // window.location.search;
}

const Results = ({ language }) => {
  const dispatch = useDispatch();
  // The view will be rendered entirely by state derived from the URL. Both immediately and
  // asynchronously as a result of API calls initiated by the URL search params. To that end
  // we want to listen primarily for changes to the URL so we can start the process of deriving
  // and collecting that state.

  // Set up the t function for translating. We need the language. Normally we get this from the
  // store. However, as this view is available in the app, there's no reason not to pass it
  // straight down.
  const t = translate(language);

  // 1. Grab current search param string:
  // We do this outside of the hook so that the hook is reactive only to changes in the querystring (we don't want
  // to make API calls unnecessarily when the searchparams haven't changed on rerenders)
  const url = useSelector(store => store.router.location);
  const urlOptionsMap = parseURL(url);
  const isSearchLandingPage = url === '/' || url === '';

  // Final. Kick off API calls based on new search params.
  // Note: We want to use the url string as the value to memoize based on.
  // Using the deconstructed object means unnecessary calls because the object
  // is new on each render.
  // N.B. The useEffect hook will in fact run after everything else in this function (it is always guaranteed
  // to run after the DOM has been rewritten). We declare it here because we want certain variables to accessible
  // in its closure.
  useEffect(() => {
    if(!isSearchLandingPage){
      initiateAPICalls(dispatch)(urlOptionsMap);
    }
  }, [dispatch, url])

  // 2. Get current results from cache.
  const currentSearch = useCurrentSearchResults();

  // 3a. Set up parameters for rendering pagers/counters.
  const {
    term,
    from,
    size,
  } = urlOptionsMap;
  // 3b. Calculate the numbers used for the results info displays.
  const resultsStart = from + 1;
  const isFirstPage = from < size;
  // If we are on the last page of results, the range might be less than the offset
  // This breaks if we don't have a current search (total) yet so we delay the calculation by wrapping it in a function call or component...
  const getResultsEnd = (step, total) => step <= total ? step : total;
  return(
    currentSearch
      ? (
          <>
            <p className="results__info-label">{ t('Results for') }: { term }</p>
            <FeatureBox bestBetsIsVisible={ isFirstPage } />
            <p className="results__info-label">{ t('Results') } {`${ resultsStart }-${ getResultsEnd(from + size, currentSearch.totalResults) }`} { t('of') } { currentSearch.totalResults } { t('for') }: { term }</p>
            <ResultsList { ...currentSearch } />
            <p className="results__info-label">{ t('Results') } {`${ resultsStart }-${ getResultsEnd(from + size, currentSearch.totalResults) }`} { t('of') } { currentSearch.totalResults }</p>
            <Pager 
              from={ from }
              size={ size }
              totalResults={ currentSearch.totalResults }
            />
            <p className="results__info-label">{ currentSearch.totalResults } { t('results found for') }: { term }</p>
            <SearchBox />
          </>
        )
      : <Spinner />
  )
}

export default Results;