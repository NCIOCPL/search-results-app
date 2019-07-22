import axios from 'axios';
import { newAPIResponse } from '../../store/actions';

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
    urlOptionsMap,
    cacheKey,
    fetchHandlers,
  } = action;
  const service = services[serviceName];
  if(service != null){
    const endpoint = service(urlOptionsMap);
    try {
      const response = await axios.get(endpoint);
      const body = response.data;
      const { formatResponse } = fetchHandlers;
      const formattedBody = formatResponse ? formatResponse(body) : body;
      dispatch(newAPIResponse(serviceName, cacheKey, formattedBody));
    }
    catch(err){
      console.log(err);
    }
  }
};

export default createApiMiddleware;