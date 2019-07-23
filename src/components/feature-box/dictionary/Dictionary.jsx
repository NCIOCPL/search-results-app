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
  // TODO: Remove the tables?
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
          { definition.text }
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
