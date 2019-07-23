import React, { useState, useCallback } from 'react';
import { useDictionary } from '../../../utilities/hooks';

const Dictionary = () => {
  const [isToggleableTextVisible, setToggleVisibility] = useState(false);
  // Yes. I'm having fun. No, my wife is not a hat. Why do you ask? It's Tuesday. Everybody knows
  // she is a chinchilla on Tuesdays. She's only a hat on Thursdays. I never could get the hang of Thursdays.
  const toggleToggle = useCallback((e) => {
    e.preventDefault();
    setToggleVisibility(!isToggleableTextVisible);
  }, [isToggleableTextVisible])
  const dictionary = useDictionary();
  if(!dictionary){
    return null;
  }
  const {
    term,
    definition,
    pronunciation,
  } = dictionary;
  // The definition text is split at the end of the first sentence and the
  // remainder hidden in a dropdown. We need to prepare for that. The odd use of '. ' to
  // identify the end of the first sentence is a bit of logic we're going to reuse from
  // bestBets.js as it has presumably been well vetted against the existing dataset (as well
  // as a bit more.)
  const definitionHtml = definition.html;
	// this is to pull out newline characters which have been found to interfere with the period + blank space method for identifying end of first sentence, ie in "tumor" definition.
	const sanitizedDefinitionText = definitionHtml.replace(/(\r\n|\n|\r)/gm," ");
  const endOfFirstSentenceTest = ". ";
	const firstSentencePartialText =  sanitizedDefinitionText.slice(0, sanitizedDefinitionText.indexOf(endOfFirstSentenceTest) + 1);
  const definitionRemainderText = sanitizedDefinitionText.slice(sanitizedDefinitionText.indexOf(endOfFirstSentenceTest) + 1);
  const hasMultipleSentences = firstSentencePartialText !== '';

  // TODO: Remove the tables?
  // TODO: No pronunciation if one doesn't exist.
  return (
    <div className="feature-box__definition">
      <h2>Definition:</h2>
      <dl>
        <dt className="term">
          <strong>{ term }</strong>
        </dt>
        {
          // It's possible a pronunciation object is not available
          // (Based on reverse engineering reqs from bestBets.js).
          pronunciation &&
            <dd className="pronunciation">
              <a
                onClick={ () => false }
                className="CDR_audiofile"
                data-nci-link-audio-file=""
                data-pathname={ pronunciation.audio }
              >
                <span className="hidden">listen</span>
              </a>
              {' '}{ pronunciation.key }{' '}
            </dd>
        }
        <dd className="feature-box__definition-container">
          <span className="feature-box__definition-text">{ hasMultipleSentences ? firstSentencePartialText : sanitizedDefinitionText }</span>
          {
            hasMultipleSentences &&
              <span 
                className={ `feature-box__definition-text ${ isToggleableTextVisible ? '' : 'feature-box__definition-text--hidden' }` }
              >{ definitionRemainderText }</span>
          }
        </dd>
      </dl>
      {
        // TODO: Need to firm up reqs for when this should show rather than
        // only on multiple sentences.
        hasMultipleSentences &&
          <div className="feature-box__definition-toggle">
            {/* TODO: This text is conditional */}
            <a onClick={ toggleToggle }>{ isToggleableTextVisible ? 'Hide' : 'Show' } full definition</a>
          </div>
      }
    </div>
  );
};

export default Dictionary;
