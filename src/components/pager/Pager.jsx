import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DropDown from './drop-down';
import { newSearch } from '../../state/store/actions';
import { formatPagerArray, keyHandler } from '../../utilities';
import { useUrlOptionsMap } from '../../utilities/hooks';
import './Pager.css';

const Pager = ({
  from,
  size,
  totalResults,
}) => {
  const dispatch = useDispatch();
  const currentUrlOptions = useUrlOptionsMap();
  const dropdownOptions = useSelector(store => store.globals.dropdownOptions);
  // The lowest step size is used to determine whether we show any nav elements at all.
  const lowestDropdownOption = dropdownOptions[0];


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

  const shouldDisplayNav = totalResults > lowestDropdownOption;
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
      <DropDown newSearch={ dropdownNewSearch } options={ dropdownOptions } size={ size } />
      <div className='pager__nav'>
        {
          !isFirstPage &&
            <div 
              className="pager__arrow" 
              tabIndex="0" 
              onClick={ () => pagerNewSearch(currentPage - 1) }
              onKeyPress={ keyHandler({
                fn: () => pagerNewSearch(currentPage - 1),
              }) }
            >{ '<' }</div>
        }
        {
          pages.map((pageNumber, idx) => {
            const isCurrent = pageNumber === currentPage;
            // A 0 represents ellipses.
            if(pageNumber > 0){
              return (
                <div 
                  key={ idx }
                  tabIndex="0"
                  className={ `pager__num ${ isCurrent ? 'pager__num--active' : ''}`}
                  onClick={ !isCurrent ? () => pagerNewSearch(pageNumber) : null }
                  onKeyPress={ keyHandler({
                    fn: !isCurrent ? () => pagerNewSearch(pageNumber) : null,
                  })}
                >{ pageNumber }</div>
              )
            }
            return (
              <div key={ idx } tabIndex="0" className='pager__num pager__ellipses'>{ '...' }</div>
            )
          })
        }
        {
          !isLastPage &&
            <div 
              className="pager__arrow" 
              tabIndex="0" 
              onClick={ () => pagerNewSearch(currentPage + 1) }
              onKeyPress={ keyHandler({
                fn: () => pagerNewSearch(currentPage + 1),
              })}
            >{ '>' }</div>
        }
      </div>
    </nav>
  );
};

export default Pager;