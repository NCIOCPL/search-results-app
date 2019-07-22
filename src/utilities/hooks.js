import { useMemo } from 'react';
import { useSelector } from 'react-redux';
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

export const useUrlOptionsMap = () => {
  const url = useSelector(store => store.results.search);
  const urlOptionsMap = useMemo(() => {
    if(!url){
      return {};
    }
    const urlOptionsMap = parseURL(url);
    // Add back in the original string for potential reference.
    return urlOptionsMap;
  }, [url]);
  return urlOptionsMap;
}