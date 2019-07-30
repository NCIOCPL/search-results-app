import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { parseURL } from './index';
/**
 * Whenever a UI component needs access to the current search
 * results they can use this hook.
 */
export const useCurrentSearchResults = () => {
  const cache = useSelector(store => store.cache);
  const cacheKey = useSelector(store => store.results.search);
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

/**
 * Whenever a UI component needs access to the current dictionary
 * results they can use this hook.
 */
export const useDictionary = () => {
  const dictionaryCache = useSelector(store => store.cache.dictionary);
  const dictionaryCacheKey = useSelector(store => store.results.dictionary);
  if(!dictionaryCache || !dictionaryCacheKey){
    return null;
  }
  const dictionary = dictionaryCache[dictionaryCacheKey];
  if(!dictionary){
    return null;
  }
  return dictionary;
}

/**
 * Whenever a UI component needs access to the current bestBets
 * results they can use this hook.
 */
export const useBestBets = () => {
  const bestBetsCache = useSelector(store => store.cache.bestBets);
  const bestBetsCacheKey = useSelector(store => store.results.bestBets);
  if(!bestBetsCache || !bestBetsCacheKey){
    return null;
  }
  const bestBets = bestBetsCache[bestBetsCacheKey];
  if(!bestBets){
    return null;
  }
  return bestBets;
}

/**
 * We return the url in addition to the newly constructed map so that
 * any hooks that need to memoize the value can do so using the string since 
 * functional components cannot maintain referential integrity for generated
 * objects on rerenders.
 */
export const useUrlOptionsMap = () => {
  const url = useSelector(store => store.results.search);
  const defaultSize = useSelector(store => store.globals.dropdownOptions)[0];
  const urlOptionsMap = useMemo(() => {
    if(!url){
      return {};
    }
    const urlOptionsMap = parseURL(url, defaultSize);
    return urlOptionsMap;
  }, [url]);
  return [url, urlOptionsMap];
}

/**
 * Emit an event to trigger our external analytics libraries when a result click is selected.
 * Include any arguments needed for the analytics call as the payload.
 * 
 * @param {number} resultIndex The ordinal index (1-indexed) of the result in its list container
 * @param {boolean} [isBestBet=false] True if the list container is a best bet feature box.
 * @returns {function} onClick handler to emit results click events.
 */
export const useResultClickEventEmitter = (resultIndex, isBestBet = false) => {
  const dispatch = useDispatch();
  const onClickHandler = useCallback(() => {
    dispatch({
      type: '@@event/result_click',
      // The arguments here will eventually be destructured into the NCI analytics function 
      // 'SiteWideSearchResults' (which in turn calls ClickParams).
      payload: [
        // The click params analytics handler requires a reference
        // to the element originating the click event. However, it never uses it.
        // To save ourselves having to also generate a React ref for each link,
        // we'll just pass null.
        null,
        // Link is not in a best bet feature box.
        isBestBet, 
        // The analytics library expect 1-indexed indexes.
        resultIndex + 1,
      ],
    });
  }, [resultIndex]);
  return onClickHandler;
}
