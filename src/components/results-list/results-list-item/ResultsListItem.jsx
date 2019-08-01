import React from 'react';
import { useSelector } from 'react-redux';
import { useResultClickEventEmitter } from '../../../utilities/hooks';
import { translate } from '../../../utilities/translation';

const ResultsListItem = ({
  title,
  url,
  description,
  resultIndex,
  contentType,
}) => {
  const resultClickEventEmitter = useResultClickEventEmitter(resultIndex);
  const language = useSelector(store => store.globals.language);
  const t = translate(language);
  const contentTypeDisplay =
    contentType === 'cgvVideo'
      ? '(Video)'  // Video in spanish is video. no need to translate
      : contentType === 'cgvInfographic'
        ? '(' + t('Infographic') + ')'
        : '';
  return (
    <li>
      <a href={url} onClick={resultClickEventEmitter}>
        {title}
      </a>
      {contentTypeDisplay && (
        <span className="media-type"> {contentTypeDisplay}</span>
      )}
      <div className="description">{description}</div>
      <cite className="url">{url}</cite>
    </li>
  );
};
export default ResultsListItem;
