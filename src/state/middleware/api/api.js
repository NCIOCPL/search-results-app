import axios from 'axios';
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
    searchParams,
  } = action;
  const service = services[serviceName];
  if(service != null){
    const endpoint = service(searchParams);
    try {
      const response = await axios.get(endpoint);
      const body = response.data;
      // Normalize response
      // Cache response with serviceName key in cache
      // Load response with serviceName key in current results
      console.log(body)
    }
    catch(err){
      console.log(err);
    }
  }
};

export default createApiMiddleware;