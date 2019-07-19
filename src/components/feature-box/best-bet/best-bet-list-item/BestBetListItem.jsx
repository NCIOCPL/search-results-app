import React from 'react';

const BestBetListItem = ({ title, link, description }) => (
  <li className="general-list-item general list-item">
    <div className="title-and-desc title desc container">
      <a className="title" href={ link }>{ title }</a>
      <div className="description">
        <p className="body">{ description }</p>
      </div>
    </div>
  </li>
)

export default BestBetListItem;