import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../utilities/translation';

const DropDown = ({ options, newSearch, size }) => {
  // Setup translation function
  const language = useSelector(store => store.globals.language);
  const t = translate(language);

  if(!options || !options.length){
    return null;
  }
  return (
    <div>
      <span>{ t('Show') }</span>
      <select value={ size } onChange={ e => newSearch(e.target.value) }>
        {
          options.map((option, opIdx) => {
            return(
              <option key={ opIdx } value={ option } >{ option }</option>
            )
          })
        }
      </select>
      <span>{ t('results per page') }.</span>
    </div>
  )
}

export default DropDown;