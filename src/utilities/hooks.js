import { useSelector } from 'react-redux';

/**
 * If the results store has a current search key, recontitute
 * the orginal shape of the processed results from the cache.
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