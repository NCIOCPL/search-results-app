import React, { useEffect, useRef  } from 'react';
import { useSelector, useDispatch} from 'react-redux';
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

  // We use this ref to allow us to reset the keyboard focus on page changes.
  const tabResetElement = useRef(null);

  // 1. Grab current search param string:
  // We do this outside of the hook so that the hook is reactive only to changes in the querystring (we don't want
  // to make API calls unnecessarily when the searchparams haven't changed on rerenders)
  const url = useSelector(store => store.router.location);
  // Becase the dropdown options are passed as dynamic configuration settings, we need to pass them
  // through so that any defaults used to construct a query are not hardcoded when they shouldn't be.
  const defaultSize = useSelector(store => store.globals.dropdownOptions)[0];
  const urlOptionsMap = parseURL(url, defaultSize);
  // Final. Kick off API calls based on new search params.
  // Note: We want to use the url string as the value to memoize based on.
  // Using the deconstructed object means unnecessary calls because the object
  // is new on each render.
  // N.B. The useEffect hook will in fact run after everything else in this function (it is always guaranteed
  // to run after the DOM has been rewritten). We declare it here because we want certain variables to accessible
  // in its closure.
  useEffect(() => {
    initiateAPICalls(dispatch)(url, urlOptionsMap);
    // Reset the keybaord focus to the top of the page on page changes.
    if(tabResetElement.current){
      tabResetElement.current.focus();
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
  const isFirstPage = from < size;
  // If we are on the last page of results, the range might be less than the offset
  // This breaks if we don't have a current search (total) yet so we delay the calculation by wrapping it in a function call or component...
  const getResultsEnd = (step, total) => step <= total ? step : total;
  const getResultsStart = (from, total) => total === 0 ? 0 : from + 1;
  return(
    currentSearch
      ? (
          <>
            <p className="results__info-label">{ t('Results for') }: { term }</p>
            <FeatureBox bestBetsIsVisible={ isFirstPage } />
            {/* Typically we would not make a p element tabbable. However, on page changes we want the tab focus to reset
            to this element so that the screen reader begins at the first non-redundant point. */}
            <p ref={ tabResetElement } tabIndex="0" className="results__info-label">{ t('Results') } {`${ getResultsStart(from, currentSearch.totalResults) }-${ getResultsEnd(from + size, currentSearch.totalResults) }`} { t('of') } { currentSearch.totalResults } { t('for') }: { term }</p>
            <ResultsList { ...currentSearch } />
            <p className="results__info-label">{ t('Results') } {`${ getResultsStart(from, currentSearch.totalResults) }-${ getResultsEnd(from + size, currentSearch.totalResults) }`} { t('of') } { currentSearch.totalResults }</p>
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