import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { newSearch } from '../../state/store/actions';
import { formatPagerArray } from '../../utilities';
import { useUrlOptionsMap } from '../../utilities/hooks';
import './Pager.css';

// TODO: Add click handlers to execute new search actions.
// TODO: Add keyhandler

const Pager = ({
  from,
  size,
  totalResults,
}) => {
  const dispatch = useDispatch();
  const currentUrlOptions = useUrlOptionsMap();
  const executeNewSearch = useCallback((page) => {
    const params = {
      ...currentUrlOptions,
      size,
      from: (page - 1) * size,
    };

    dispatch(newSearch(params));
  }, [dispatch, currentUrlOptions, size]);


  const isSinglePageOnly = totalResults <= size;
  if(isSinglePageOnly){
    // TODO: Remove the following note after code review.
    // The current prod site keeps the dropdown for results per page even when
    // there are zero results. I'm changing the requirements because that makes no sense.
    return null;
  }

  // TODO: Double check these assumptions still hold.
  // Also, there may never be starts that are not steps of the pagesize.
  const isFirstPage = from <= size;
  const isLastPage = from >= totalResults - size;
  const totalPages = Math.ceil(totalResults / size);
  const currentPage = Math.ceil((from + 1) / size); // This is probably not neccesary.
  const pages = formatPagerArray(totalPages, currentPage);
  return (
    <nav className="pager__container">
      <div className='pager__nav'>
        {
          !isFirstPage &&
            <div className="pager__arrow">{ '<' }</div>
        }
        {
          pages.map((pageNumber, idx) => {
            const isCurrent = pageNumber === currentPage; // To be used for disabling click action
            // A 0 represents an ellipses
            if(pageNumber > 0){
              return (
                <div 
                  key={ idx } 
                  className={ `pager__num ${ isCurrent ? 'pager__num--active' : ''}`}
                  onClick={ !isCurrent ? () => executeNewSearch(pageNumber) : null }
                >{ pageNumber }</div>
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