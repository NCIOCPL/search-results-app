export const initialState = {
  location: '',
}

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case '@@router/update_location':
      return {
        ...state,
        location: action.payload,
      }
    default:
      return state;
  }
}