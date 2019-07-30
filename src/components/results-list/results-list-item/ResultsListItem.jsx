import React from 'react';
import { useResultClickEventEmitter } from '../../../utilities/hooks';

const ResultsListItem = ({ title, url, description, resultIndex }) => {
  const resultClickEventEmitter = useResultClickEventEmitter(resultIndex);
  return (
    <li>
      <a href={ url } onClick={ resultClickEventEmitter } >{ title }</a>
      <div className="description">{ description }</div>
      <cite className="url">{ url }</cite>
    </li>
  )
}
export default ResultsListItem;