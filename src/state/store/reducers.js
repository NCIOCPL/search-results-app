// Import all the reducers and reexport them.
// When the app is instantiated all the exported files here will be combined in a call to combineReducers
// in addition to any third party reducers tha may need to be passed in.
export { reducer as cache } from './cache';
export { reducer as error } from './error';
export { reducer as results } from './results';
export { reducer as router } from './router';
export { reducer as globals } from './globals';