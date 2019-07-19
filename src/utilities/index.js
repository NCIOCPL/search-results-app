import querystring from 'query-string';

/**
 * Process, validate, and typecast variables correctly from
 * the raw object created by the querystring library.
 * 
 * @param {Object} unformattedSearchParams
 * @return {Object} formatted search params
 */
export const parseSearchParams = searchParamsString => {
  const formattedSearchParams = querystring.parse(searchParamsString, {
    parseNumbers: true,
    parseBooleans: true,
  })
  return formattedSearchParams;
};
