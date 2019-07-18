import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Results = () => {
  // The view will be rendered entirely by state derived from the URL. Both immediately and
  // asynchronously as a result of API calls initiated by the URL search params. To that end
  // we want to listen primarily for changes to the URL so we can start the process of deriving
  // and collecting that state.
  useEffect(() => {
    // Grab query string
    // Check for changes to querystring
    // Parse query string through helper
    // Fire off API calls

  })

  // Read store state
  //    Select editor state:
  //      Select current results
  //        const currentResults = useSelector(store => store.current.search);
  //      Select current bestbets
  //      Select current dictionary

  // Parse, format, process, normalize selected state using utility helpers as much as possible

  return(
    // Render outline
    //    If store has current results for search - display
    //          If is first page of search results
    //             If a store has current best bets - display best bets
    //                If store has current dictionary - display dictionary
    //          else If store has current dictionary - display dictionary
    //    else SPINNER!!
    <div>
      Results
    </div>
  )
}

export default Results;