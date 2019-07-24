import querystring from 'query-string';

// When the utility function count grows, break these out into more specific modules by function.

// Returning undefined ensures Redux will load from initialState if sessionStorage isn't available
export const loadStateFromSessionStorage = appId => {
  try {
      const serializedState = sessionStorage.getItem(appId);
      if(serializedState === null) {
          return undefined;
      }
      return JSON.parse(serializedState);
  }
  catch(err) {
      return undefined;
  }
}

export const saveStatetoSessionStorage = ({
  state,
  appId,
}) => {
  try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem(appId, serializedState)
  }
  catch(err) {
    // As session storage backup is a bonus feature. We don't want to
    // throw anything major. If we add in a better logging system, this would be
    // good use case for it.
    console.log(err);
  }
}

export const removeLeadingSlash = url => {
  // Remove leading slash if any.
  const test = /(\/?)(.+)/;
  const sanitized = url.match(test)[2];
  return sanitized;
}

/**
 * Process, validate, and typecast variables correctly from
 * the raw object created by the querystring library.
 * 
 * @param {Object} unformattedSearchParams
 * @return {Object} formatted search params
 */
export const parseURL = url => {
  if(!url){
    return {};
  }
  const [term, searchParamsString] = removeLeadingSlash(url).split('?');
  const decodedTerm = decodeURI(term);
  const urlOptions = querystring.parse(searchParamsString, {
    parseNumbers: true,
    parseBooleans: true,
  })
  urlOptions.term = decodedTerm;
  return urlOptions;
};

export const constructURL = urlOptionsMap => {
  const { term, size = 10, from = 0 } = urlOptionsMap;
  const params = { size, from };
  const encodedTerm = encodeURI(term);
  const encodedParams = querystring.stringify(params);
  const url = `${encodedTerm}?${encodedParams}`;
  return url;
}

/**
 * Generate an array representing the currently selectable page skip numbers. 0 is
 * used to represent an ellipses and will be rendered as such. Previous and next are handled
 * externally.
 * 
 * @param {number} total 
 * @param {number} current
 * @return {number[]} pages
 */
export const formatPagerArray = (total, current) => {
  const pagesFromStart = current;
  const pagesFromEnd = total - current;
  let pages;
  if(pagesFromStart > 5){
      pages = [1, 0, current - 2, current - 1, current];
  }
  else {
      pages = Array(current).fill().map((el, idx) => idx + 1); 
  }
  if(pagesFromEnd > 5) {
      pages = [...pages, current + 1, current + 2, 0, total];
  }
  else {
      const remainingPages = Array(pagesFromEnd).fill().map((el, idx) => current + idx + 1);
      pages = [ ...pages, ...remainingPages ]; 
  }
  return pages;
}

/**
 * A higher order function to handle key events. Especially useful in cases where you want multiple keys to
 * trigger the same event. Pass in the callback you want the keypress to trigger and an array 
 * of keys (using either reserved keychar strings or the numeric keycode),
 * and get back out a wrapped version of your function to use as an eventListener callback that is
 * set to trigger only in cases where the keypress event is triggered by 
 * one of the specified keys.
 * 
 * Additional paramaters allow you to control the stopPropagation and preventDefault handling of the browser.
 * @param {Object} options
 * @param {function} [options.fn = () => {}]
 * @param {Array<Number|String>} [options.keys = []] 
 * @param {boolean} [options.stopProp = false] 
 * @param {boolean} [options.prevDef = false]
 * @return {function} A wrapped version of your function to pass to use as an eventListener callback
 */
export const keyHandler = (options = {}) => e => {
  if(typeof options !== 'object' || options === null) {
      return;
  }
  
  const {
      fn = () => {}, 
      keys = ['Enter', ' '], 
      stopProp = true, 
      prevDef = true
  } = options;

  if (keys.indexOf(e.key) !== -1) {
      stopProp && e.stopPropagation();
      prevDef && e.preventDefault();
      return fn();
  }
}