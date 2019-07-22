import React, { useState } from 'react';

const SearchBox = () => {
  const [radio, setRadio] = useState(1);
  const [textInput, updateTextInput] = useState('');

  const onSubmit = () => { };

  return (
    <form onSubmit={ onSubmit }>
			<span className="radio">
        <input 
          id="ctl34_rblSWRSearchType_0" 
          type="radio" 
          name="ctl34$rblSWRSearchType" 
          value="1" 
          checked={ radio === 1 }
          onChange={ () => setRadio(1) }
        />
        <label htmlFor="ctl34_rblSWRSearchType_0">{ "New Search     " }</label>
        <input 
          id="ctl34_rblSWRSearchType_1" 
          type="radio" 
          name="ctl34$rblSWRSearchType" 
          value="2" 
          checked={ radio === 2 }
          onChange={ () => setRadio(2) }
        />
        <label htmlFor="ctl34_rblSWRSearchType_1">Search Within Results</label>
      </span>
      <div className="row collapse">
        <div className="small-12">
          <label htmlFor="ctl34_txtSWRKeyword" id="ctl34_lblSWRKeywordLabel" className="hidden">Keyword</label>
          <input 
            id="ctl34_txtSWRKeyword" 
            name="ctl34$txtSWRKeyword" 
            className="input" 
            type="text" 
            maxLength="40" 
            size="40" 
            placeholder="Enter keywords or phrases" 
            aria-label="Enter keywords or phrases"
            value={ textInput }
            onChange={ e => updateTextInput(e.target.value) }
          />
          <input 
            type="submit" 
            name="ctl34$btnSWRTxtSearch" 
            value="Search" 
            className="button submit"
          />
        </div>
      </div>
		</form>
  )
}

export default SearchBox;