export const NEW_ERROR = "NEW ERROR";
export const CLEAR_ERRORS = "CLEAR ERRORS";

export const clearErrors = () => ({
  type: CLEAR_ERRORS,
})

export const registerError = (errorType) => {
  return {
    type: NEW_ERROR,
    payload: errorType,
  }
}

export const initialState = null;

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case CLEAR_ERRORS:
      return initialState;
    case NEW_ERROR:
      return action.payload;
    default:
      return state;
  }
}