import React from 'react';
import track from 'react-tracking';
import { AnalyticsProvider, EddlAnalyticsHandler } from './';
import WrapperComponent from './wrapper-component';

/**
 * A HoC to handle deficiencies in the react-tracking module when using stateless
 * function. This is used to wrap the app so that we can bind the analyticsHandler
 * to the dispatch function for the tracking.
 *
 * @param {Object} props - The props
 * @param {array} props.children - the child objects
 * @param {function} props.analyticsHandler - The function for handling tracking dispatches
 * TODO: Document page object override
 */
const EddlAnalyticsProvider = ({
  children,
  analyticsHandler = EddlAnalyticsHandler,
  pageName,
  pageTitle,
  pageMetaTitle,
  pageLanguage,
  pageAudience,
  pageChannel,
  pageContentGroup,
  pagePublishedDate,
  ...pageAdditionalDetails
}) => {
  
  const TrackingWrapper = track(
    {
      name: pageName,
      title: pageTitle,
      metaTitle: pageMetaTitle,
      language: pageLanguage,
      audience: pageAudience,
      channel: pageChannel,
      contentGroup: pageContentGroup,
      publishedDate: pagePublishedDate,
      ...pageAdditionalDetails
    },
    { 
      dispatch: analyticsHandler 
    }
  )(WrapperComponent);

  return (
    <AnalyticsProvider analyticsHandler={analyticsHandler}>
      <TrackingWrapper>
        {children}
      </TrackingWrapper>
    </AnalyticsProvider>
  );

};

export default EddlAnalyticsProvider;