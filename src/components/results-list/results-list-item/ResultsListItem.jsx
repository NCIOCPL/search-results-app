import React from 'react';
import { useSelector } from 'react-redux';
import { useTracking } from 'react-tracking';
import { translate } from '../../../utilities/translation';

const ResultsListItem = ({
  title,
  url,
  description,
  resultIndex,
  contentType,
}) => {

  // Analytics for search result click
  const tracking = useTracking();
  const clickHandler = () => {
    tracking.trackEvent({
      type: 'Other',
      event: 'SearchResultsApp:Other:ResultClick',
      linkName: 'SiteWideSearchResults',
      resultTitle: title,
      resultUrl: url,
      resultIndex,
      resultSource: 'generic'
    });
  };

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
      <a href={url} onClick={clickHandler}>
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
