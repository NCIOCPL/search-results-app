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
    const cachedValue = cache[cacheKey];
    if(cachedValue != null){
      dispatch({
        type: 'UPDATE RESULTS',
        payload: cachedValue,
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