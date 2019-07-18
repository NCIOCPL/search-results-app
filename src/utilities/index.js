import querystring from 'querystring';

/**
 * Process, validate, and typecast variables correctly from
 * the raw object created by the querystring library.
 * 
 * @param {Object} unformattedSearchParams
 * @return {Object} formatted search params
 */
export const parseSearchParams = searchParamsString => {
  const unformattedSearchParams = querystring.parse(searchParamsString);
  const { 
    page: pageString,
    pageunit: pageunitString,
    Offset: OffsetString,
  } = unformattedSearchParams;
  const page = parseInt(pageString);
  const pageunit = parseInt(pageunitString);
  const Offset = parseInt(OffsetString);
  return {
    ...unformattedSearchParams,
    page,
    pageunit,
    Offset,
  }
};
