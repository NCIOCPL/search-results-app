import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newSearch } from '../../state/store/actions';
import { useUrlOptionsMap } from '../../utilities/hooks';
import { translate } from '../../utilities/translation';

const SearchBox = () => {
  const dispatch = useDispatch();
  const [radio, setRadio] = useState(1);
  const [textInput, updateTextInput] = useState('');
  const [url, currentUrlOptions] = useUrlOptionsMap();

  // Set up translation function
  const language = useSelector(store => store.globals.language);
  const t = translate(language);

  const executeNewSearch = useCallback(() => {
    console.log({currentUrlOptions})
    const newTerm = textInput;
    const oldTerm = currentUrlOptions ? currentUrlOptions.term : '';
    const searchType = radio === 1 ? 'search' : 'search_within';
    const term = searchType === 'search' ? newTerm : `${ newTerm } ${ oldTerm }`;
    const params = {
      from: 0,
      size: currentUrlOptions ? currentUrlOptions.size : 20,
      term,
    }
    dispatch(newSearch(params));
  }, [dispatch, textInput, url, radio]);
  
  return (
    <form onSubmit={e => {
      e.preventDefault();
      executeNewSearch();
      updateTextInput('');
    }}>
			<span className="radio">
        <input 
          id="ctl34_rblSWRSearchType_0" 
          type="radio" 
          name="ctl34$rblSWRSearchType" 
          value="1" 
          checked={ radio === 1 }
          onChange={ () => setRadio(1) }
        />
        <label htmlFor="ctl34_rblSWRSearchType_0">{ t('New Search') }</label>
        <input 
          id="ctl34_rblSWRSearchType_1" 
          type="radio" 
          name="ctl34$rblSWRSearchType" 
          value="2" 
          checked={ radio === 2 }
          onChange={ () => setRadio(2) }
        />
        <label htmlFor="ctl34_rblSWRSearchType_1">{ t('Search Within Results') }</label>
      </span>
      <div className="row collapse">
        <div className="small-12">
          <label htmlFor="ctl34_txtSWRKeyword" id="ctl34_lblSWRKeywordLabel" className="hidden">Keyword</label>
          <input 
            id="ctl34_txtSWRKeyword" 
            name="ctl34$txtSWRKeyword" 
            className="input" 
            type="text" 
            size="40" 
            placeholder="Enter keywords or phrases" 
            aria-label="Enter keywords or phrases"
            value={ textInput }
            onChange={ e => updateTextInput(e.target.value) }
          />
          <input 
            type="submit" 
            name="ctl34$btnSWRTxtSearch" 
            value={ t('Search') } 
            className="button submit"
          />
        </div>
      </div>
		</form>
  )
}

export default SearchBox;