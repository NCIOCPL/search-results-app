// This represents our state management organization for things related to the current 
// search (ie state derived from the current URL/searchParams and derivative API calls).
// As much as possible, data should be normalized and cached and current results should ideally be
// references to cached results.
import { NEW_API_RESPONSE } from '../actions';

export const UPDATE_RESULTS = 'UPDATE RESULTS';

export const updateResults = (key, value) => ({
  type: UPDATE_RESULTS,
  payload: {
    key,
    value
  }
})


export const initialState = {
  search: null,
  bestBets: null,
  dictionary: null,
}

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case NEW_API_RESPONSE:
      // All we need to do is store the cache key. The view will select and reconstitute the cached
      // items.
      const { serviceName, cacheKey } = action.payload;
      return {
        ...state,
        [serviceName]: cacheKey,
      }
    case UPDATE_RESULTS:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      }
    default:
      return state;
  }
}