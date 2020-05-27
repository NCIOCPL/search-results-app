import React from 'react';
import { useTracking } from 'react-tracking';

const BestBetListItem = ({ title, link, description, resultIndex }) => {

  // Analytics considers a best bet result to be the same
  // as a search result.
  const tracking = useTracking();
  const clickHandler = () => {
    tracking.trackEvent({
      type: 'Other',
      event: 'SearchResultsApp:Other:ResultClick',
      linkName: 'SiteWideSearchResults',
      resultTitle: title,
      resultUrl: link,
      resultIndex,
      resultSource: 'best_bets'
    });
  };
  
  return (
    <li className="general-list-item general list-item">
      <div className="title-and-desc title desc container">
        <a className="title" href={ link } onClick={ clickHandler }>{ title }</a>
        <div className="description">
          <p className="body">{ description }</p>
        </div>
      </div>
    </li>
  )
}

export default BestBetListItem;