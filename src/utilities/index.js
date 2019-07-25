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
 * BIG NOTE:
 * The results page url needs to be backwards compatible. The new search API
 * uses different values. The API takes a term, a from, and a size paramater. The url
 * needs to support pageunit, Offset, swKeyword, old_keywords, and page paramaters.
 * 
 * We need to do the conversion here so that the rest of the app is agnostic to the 
 * legacy syntax. We'll also need to convert back to the old syntax everytime we update the
 * page URL manually to execute a new search. Ideally in a deterministic order.
 * 
 * Since some values can be derived, we need to support various combinations of params.
 * 
 * Rules: 
 * 1. swKeyword and old_keywords (if it exists) need to be combined as the term.
 * 2. pageunit is equivalent to size, Offset is equivalent to from.
 * 3. page can be derived from pageunit and Offset.
 * 4. Offset can be derived from page and pageunit.
 * 5. If one of the three variables does not exist, we derive the from and size from the other two.
 * 6. If we cannot derive any value, we use a default.
 * 
 * @param {Object} unformattedSearchParams
 * @return {Object} formatted search params
 */
export const parseURL = (url, defaultSize = 20) => {
  const defaultsForUrlOptions = {
    term: '',
    from: 0,
    size: defaultSize,
  };

  if(!url){
    return defaultsForUrlOptions;
  }

  const legacyUrlOptions = querystring.parse(url, {
    parseNumbers: true,
    parseBooleans: true,
  });
  
  const { 
    swKeyword, 
    old_keywords,
    pageunit,
    Offset,
    page
  } = legacyUrlOptions;

  // 1. swKeyword and old_keywords (if it exists) need to be combined as the term.
  const term = `${ swKeyword ? swKeyword : '' } ${ old_keywords ? old_keywords : '' }`.trim();

  // 2 - 5:
  let { from, size } = defaultsForUrlOptions;
  // 2. pageunit is equivalent to size, Offset is equivalent to from, natch.
  if(Number.isInteger(pageunit) && Number.isInteger(Offset)){
    from = Offset;
    size = pageunit;
  }
  // If one of the three variables does not exist, we derive the from and size from the other two.
  else if(Number.isInteger(page) && Number.isInteger(Offset)){
    from = Offset;
    size = Offset / (page - 1);
  }
  else if(Number.isInteger(page) && Number.isInteger(pageunit)){
    from = (page - 1) * pageunit;
    size = pageunit;
  }
  // 6.
  else {
    // We don't have enough information to derive the intended params deterministically.
    // We use the defaults set at the beginning.
  }

  const urlOptions = {
    term,
    from,
    size,
  }

  return urlOptions;
};

/**
 * We want the URL to use the legacy syntax, so we need to convert the API
 * values back to the old params. However, this URL will be immediately decoded again by
 * the parseURL function prior to making any API calls and therefore does not need to use
 * page or old_keywords.
 */
export const constructURL = urlOptionsMap => {
  const { term, size, from } = urlOptionsMap;
  const params = {
    swKeyword: term,
    pageunit: size,
    Offset: from,
  };
  const encodedParams = querystring.stringify(params);
  const url = `?${encodedParams}`;
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