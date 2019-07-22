import querystring from 'query-string';
// Action creator and controllers that are not directly associated with reducers. i.e., actions that target middleware
// or complex sets of action creators.

export const initiateSearchAction = dispatch => searchConfig => {
    dispatch(initiateSiteWideSearchQuery(searchConfig));
    dispatch(initiateDictionaryQuery(searchConfig));
    // TODO: Don't call this except when the service has been specified in the initialization. (Only CGOV gets best bets)
    // We only want to call bestBets when it's the first page of results.
    const isFirstPage = searchConfig.params.page === 1;
    if(isFirstPage){
        dispatch(initiateBestBetsQuery(searchConfig));
    }
}

export const initiateSiteWideSearchQuery = searchConfig => {
    // TODO: To be abstracted into encoding function
    // While it would be preferable to encode this in the external service passed in,
    // we need to generate the query string now for the cache lookup. Since we are already generating it
    // once we don't want to repeat ourselves and potentially have two different methods for doing so
    // existing in the same code pipeline.
    const encodedTerm = encodeURI(searchConfig.term);
    const encodedParams = querystring.stringify(searchConfig.params);
    const queryString = `${ encodedTerm }?${ encodedParams }`;
    searchConfig.queryString = queryString;

    return {
        type: '@@cache/RETRIEVE',
        searchConfig,
        service: 'search',
        cacheKey: queryString,
        fetch: {},
    }
}

export const initiateBestBetsQuery = searchConfig => {
    return {
        type: '@@cache/RETRIEVE',
        searchConfig,
        service: 'bestBets',
        cacheKey: searchConfig.term,
        fetch: {},
    }
}

export const initiateDictionaryQuery = searchConfig => {
    return {
        type: '@@cache/RETRIEVE',
        searchConfig,
        service: 'dictionary',
        cacheKey: searchConfig.term,
        fetch: {},
    }
}