import React from 'react';

const ResultsListItem = ({ title, url, description }) => (
  <li>
    <a href={ url }>{ title }</a>
    <div className="description">{ description }</div>
    <cite className="url">{ url }</cite>
  </li>
)
export default ResultsListItem;