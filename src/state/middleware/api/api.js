import axios from 'axios';


const cacheAPIResponse = (serviceName, cacheKey, body) => {
  return {
    type: 'poop',
  }
}

const loadAPIResponse = (serviceName, body) => {
  return {
    type: 'poop 2: poop harder',
  }
}

/**
 * This middleware serves two purposes (and could perhaps be broken into two pieces).
 * 1. To set up API requests with all the appropriate settings
 * 2. To handle the attendant responses and failures. Successful requests will need to be cached and then
 * sent to the store. Failures will need to be taken round back and shot.
 * @param {Object} services 
 */
const createApiMiddleware = services => ({ dispatch, getState }) => next => async action => {
  next(action);

  if(action.type !== '@@api/FETCH'){
      return;
  }

  const { 
    service: serviceName,
    searchConfig,
    cacheKey,
  } = action;
  const service = services[serviceName];
  if(service != null){
    const endpoint = service(searchConfig);
    try {
      const response = await axios.get(endpoint);
      const body = response.data;
      dispatch(cacheAPIResponse(serviceName, cacheKey, body));
      // We need to cache the response so that references to it in normalized
      // data are not missing.
      dispatch(loadAPIResponse(serviceName, body));
      console.log(serviceName, cacheKey, body)
    }
    catch(err){
      console.log(err);
    }
  }
};

export default createApiMiddleware;