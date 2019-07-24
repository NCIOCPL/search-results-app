import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import DropDown from './drop-down';
import { newSearch } from '../../state/store/actions';
import { formatPagerArray } from '../../utilities';
import { useUrlOptionsMap } from '../../utilities/hooks';
import './Pager.css';

// TODO: Add keyhandler

// We define these here to make it more obvious how the first
// option is used to determine whether or not enough results were
// returned to necessitate showing the navigation elements at all.
const RESULT_SIZE_OPTIONS = [ 10, 20, 50 ];
const LOWEST_STEP_SIZE = RESULT_SIZE_OPTIONS[0];

const Pager = ({
  from,
  size,
  totalResults,
}) => {
  const dispatch = useDispatch();
  const currentUrlOptions = useUrlOptionsMap();

  const pagerNewSearch = useCallback((page) => {
    const params = {
      ...currentUrlOptions,
      size,
      from: (page - 1) * size,
    };

    dispatch(newSearch(params));
  }, [dispatch, currentUrlOptions, size]);

  const dropdownNewSearch = useCallback((size) => {
    const params = {
      ...currentUrlOptions,
      from: 0,
      size,
    }
    dispatch(newSearch(params));
  }, [dispatch, size, currentUrlOptions])

  const shouldDisplayNav = totalResults > LOWEST_STEP_SIZE;
  // When the results are so few that navigation will never be necessary don't show anything.
  if(!shouldDisplayNav){
    return null;
  }
  // TODO: Determine what the behavior is on pages that fall between the lowest and highest option
  // counts.

  const isFirstPage = from < size;
  const isLastPage = from >= totalResults - size;
  const totalPages = Math.ceil(totalResults / size);
  const currentPage = Math.ceil((from + 1) / size); // This is probably not neccesary.
  const pages = formatPagerArray(totalPages, currentPage);
  return (
    <nav className="pager__container">
      <DropDown newSearch={ dropdownNewSearch } options={ RESULT_SIZE_OPTIONS } size={ size } />
      <div className='pager__nav'>
        {
          !isFirstPage &&
            <div className="pager__arrow" onClick={ () => pagerNewSearch(currentPage - 1) }>{ '<' }</div>
        }
        {
          pages.map((pageNumber, idx) => {
            const isCurrent = pageNumber === currentPage;
            // A 0 represents ellipses.
            if(pageNumber > 0){
              return (
                <div 
                  key={ idx } 
                  className={ `pager__num ${ isCurrent ? 'pager__num--active' : ''}`}
                  onClick={ !isCurrent ? () => pagerNewSearch(pageNumber) : null }
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
            <div className="pager__arrow" onClick={ () => pagerNewSearch(currentPage + 1) }>{ '>' }</div>
        }
      </div>
    </nav>
  );
};

export default Pager;