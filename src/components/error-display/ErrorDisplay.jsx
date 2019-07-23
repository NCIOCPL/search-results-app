import React from 'react';
import { useSelector } from 'react-redux';
import SearchBox from '../search-box';

const ErrorDisplay = () => {
  const error = useSelector(store => store.error);
  if(error === 'FATAL') {
    return (
      <div>An unknown error was encountered. Please try refreshing the page.</div>
    )
  }
  return (
    <div>
      Error:
      { error }
      <SearchBox />
    </div>
  )
}

export default ErrorDisplay;