import React from 'react';
import './Pager.css';

/**
 * RENDER HELPER
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


// I notice that the pager on SWS doesn't behave the same as cts or r4r (no ellipsis). I think this is 
// a mistake and will make my own requirements.

// TODO: Add click handlers to execute new search actions.
// TODO: Add keyhandler

const Pager = ({
  page,
  pageSize,
  start,
  totalResults,
}) => {
  const isSinglePageOnly = totalResults <= pageSize;
  if(isSinglePageOnly){
    // TODO: Remove the following note after code review.
    // The current prod site keeps the dropdown for results per page even when
    // there are zero results. I'm changing the requirements because that makes no sense.
    return null;
  }
  // TODO: Double check these assumptions still hold.
  // Also, there may never be starts that are not steps of the pagesize.
  const isFirstPage = start <= pageSize;
  const isLastPage = start >= totalResults - pageSize;
  const totalPages = Math.ceil(totalResults / pageSize);
  // const currentPage = Math.ceil(start / pageSize); // This is probably not neccesary.
  const pages = formatPagerArray(totalPages, page);
  return (
    <nav className="pager__container">
      <div className='pager__nav'>
        {
          !isFirstPage &&
            <div className="pager__arrow">{ '<' }</div>
        }
        {
          pages.map((pg, idx) => {
            const isCurrent = pg === page; // To be used for disabling click action
            // A 0 represents an ellipses
            if(pg > 0){
              return (
                <div key={ idx } className={ `pager__num ${ isCurrent ? 'pager__num--active' : ''}`}>{ pg }</div>
              )
            }
            return (
              <div key={ idx } className='pager__num pager__ellipses'>{ '...' }</div>
            )
          })
        }
        {
          !isLastPage &&
            <div className="pager__arrow">{ '>' }</div>
        }
      </div>
    </nav>
  );
};

export default Pager;