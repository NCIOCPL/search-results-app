// Action creator and controllers that are not directly associated with reducers. i.e., actions that target middleware
// or complex sets of action creators.
import { parseSearchParams } from '../../utilities';

export const initiateSearchAction = dispatch => searchParamsString => {
    dispatch(initiateSiteWideSearchQuery(searchParamsString));

    const searchParams = parseSearchParams(searchParamsString);
    dispatch(initiateDictionaryQuery(searchParams));

    // TODO: Don't call this except when the service has been specified in the initialization. (Only CGOV gets best bets)
    // We only want to call bestBets when it's the first page of results.
    const isFirstPage = searchParams.page === 1;
    if(isFirstPage){
        dispatch(initiateBestBetsQuery(searchParams));
    }
}

export const initiateSiteWideSearchQuery = searchParams => {
    const queryString = searchParams // Generate query string
    return {
        type: '@@cache/RETRIEVE',
        searchParams,
        service: 'search',
        cacheKey: queryString,
        fetch: {},
    }
}

export const initiateBestBetsQuery = searchParams => ({
    type: '@@cache/RETRIEVE',
    searchParams,
    service: 'bestBets',
    cacheKey: searchParams.swKeyword, // Or term or something
    fetch: {},
})

export const initiateDictionaryQuery = searchParams => ({
    type: '@@cache/RETRIEVE',
    searchParams,
    service: 'dictionary',
    cacheKey: searchParams.swKeyword, // Or term or some such
    fetch: {},
})