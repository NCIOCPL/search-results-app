export const initialState = {
  language: 'en',
  dropdownOptions: [ 20, 50 ],
};

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case '@@globals/load_value':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case '@@globals/load_values':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}