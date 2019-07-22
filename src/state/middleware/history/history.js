/**
 * The purpose of this middleware is twofold.
 * 
 * 1. To manipulate the History API through the history library's object
 * 2. To record that change in the history reducer
 * 
 * @param {*} history 
 */
const createHistoryMiddleware = history => ({ dispatch }) => next => action => {
  next(action)
  // The history object needs to be updated before recording the change to ensure they are synchronized.
  if(action.type === '@@router/location_change'){
    // Call changes to history based on action payload
    history.push(action.payload);
  }


}

export default createHistoryMiddleware;