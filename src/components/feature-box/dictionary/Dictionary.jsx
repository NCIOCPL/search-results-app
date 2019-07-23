import React from 'react';
import { useDictionary } from '../../../utilities/hooks';

const Dictionary = () => {
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
        <dd className="definition">
          <span>{ hasMultipleSentences ? firstSentencePartialText : sanitizedDefinitionText }</span>
          {
            hasMultipleSentences &&
              <span>{ definitionRemainderText }</span>
          }
          {/* HOW DOES THIS GET DIVIDED?? (probably the stupid jquery 'library') */}
          {/* <span id="definitionStart">
            An abnormal mass of tissue that results when cells divide more than
            they should or do not die when they should.
          </span>
          <span id="definitionEnd">
            {' '}
            Tumors may be benign (not cancer), or malignant (cancer). Also
            called neoplasm.
          </span> */}
        </dd>
      </dl>
    </div>
  );
};

export default Dictionary;
