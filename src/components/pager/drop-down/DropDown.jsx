import React from 'react';

const DropDown = ({ options, newSearch, size }) => {
  if(!options || !options.length){
    return null;
  }
  return (
    <div>
      <span>Show</span>
      <select value={ size } onChange={ e => newSearch(e.target.value) }>
        {
          options.map((option, opIdx) => {
            return(
              <option key={ opIdx } value={ option } >{ option }</option>
            )
          })
        }
      </select>
      <span>results per page.</span>
    </div>
  )
}

export default DropDown;