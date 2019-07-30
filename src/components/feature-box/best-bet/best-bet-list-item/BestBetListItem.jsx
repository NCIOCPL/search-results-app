import React from 'react';
import { useResultClickEventEmitter } from '../../../../utilities/hooks';

const BestBetListItem = ({ title, link, description, resultIndex }) => {
  const resultClickEventEmitter = useResultClickEventEmitter(resultIndex, true);
  
  return (
    <li className="general-list-item general list-item">
      <div className="title-and-desc title desc container">
        <a className="title" href={ link } onClick={ resultClickEventEmitter }>{ title }</a>
        <div className="description">
          <p className="body">{ description }</p>
        </div>
      </div>
    </li>
  )
}

export default BestBetListItem;