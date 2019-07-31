import { NEW_API_RESPONSE } from '../actions';

export const initialState = {
  search: null,
  resultItems: null,
  bestBets: null,
  dictionary: null,
}

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case NEW_API_RESPONSE:
      // Each type of API call has its own requirements for storage which we need to handle
      // differently. We can use the serviceName to distinguish.
      const { serviceName, cacheKey, body } = action.payload;
      switch(serviceName){
        case 'search':
          // Search results will be normalized, each result item will only retain it's url, referring to the
          // matching item in the resultItems map.
          // It's easier to process the resultItems in advance.
          const newResultItems = body.results.reduce((acc, curr) => {
            const { url, title } = curr;

            // Result Items come back with a NCI suffix which we don't want to display to the user.
            // Because we aren't using it for any other purposes, we'll remove it altogether before
            // caching the API result. This will save us several bytes of memory as well!!!
            // Unfortunately, the suffix is language dependent so we need to sanitize the string for
            // both options.
            const test = /- National Cancer Institute|- Instituto Nacional del Cáncer$/i
            const sanitizedTitle = title.replace(test, '').trim();
            curr.title = sanitizedTitle;

            // Creating a key/value with the key as the result url for the search cache to reference.
            acc[url] = curr;
            return acc;
          }, {});
          return {
            ...state,
            search: {
              ...state.search,
              [cacheKey]: { 
                ...body,
                results: body.results.map(resultItem => resultItem.url),
              },
            },
            resultItems: {
              ...state.resultItems,
              ...newResultItems,
            }
          }
        case 'bestBets':
          return {
            ...state,
            bestBets: {
              ...state.bestBets,
              [cacheKey]: body,
            },
          };
        case 'dictionary':
          return {
            ...state,
            dictionary: {
              ...state.dictionary,
              [cacheKey]: body,
            },
          };
        default:
          return state;
      }
    default:
      return state;
  }
}