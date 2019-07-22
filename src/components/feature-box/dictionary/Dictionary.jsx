import React from 'react';
import { useSelector } from 'react-redux';

const Dictionary = () => {
  const dictionaryCache = useSelector(store => store.cache.dictionary);
  const dictionaryCacheKey = useSelector(store => store.results.dictionary);
  if (!dictionaryCacheKey) {
    return null;
  }
  const dictionary = dictionaryCache[dictionaryCacheKey];
  if(!dictionary){
    return null;
  }
  const {
    term,
    definition,
    pronunciation,
  } = dictionary;
  return (
    <div className="best-bet-definition">
      <h2>Definition:</h2>
      <dl>
        <dt className="term">
          <strong>{ term }</strong>
        </dt>
        <dd className="pronunciation">
          <a
            // this is triggering a big ole react warning
            href="javascript:void(0)"
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
