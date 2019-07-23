export const initialState = {
  language: 'en',
};

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case '@@globals/load_value':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
}