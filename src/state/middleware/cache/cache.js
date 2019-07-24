const cacheMiddleware = ({ dispatch, getState }) => next => action => {
  next(action);

  if(action.type !== '@@cache/RETRIEVE'){
      return;
  }
  
  const { service, cacheKey } = action;

  const store = getState();
  const cache = store.cache[service];
  // The cache will be empty on the first call (provided we haven't rehydrated from sessionStorage).
  if(cache != null){
    // We want to see if there is a cached value. We cannot use a null test because we cache failed
    // responses as null to avoid future calls on the same value unnecessarily. Therefore, to test
    // whether a key has been cached or not, we check whether the key exists at all on the cached object.
    const isCached = cache.hasOwnProperty(cacheKey);
    if(isCached){
      dispatch({
        type: 'UPDATE RESULTS',
        payload: {
          serviceName: service,
          cacheKey,
        },
      })
      return;
    }
  }

  dispatch({
    ...action,
    type: '@@api/FETCH',
  });

}

export default cacheMiddleware;