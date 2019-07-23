import React from 'react';

const DropDown = ({ options, newSearch, size }) => {
  if(!options || !options.length){
    return null;
  }
  return (
    <div>
      <span>Show</span>
      <select onChange={ e => newSearch(e.target.value) }>
        {
          options.map((option, opIdx) => {
            return(
              <option key={ opIdx } value={ option } selected={ option === size }>{ option }</option>
            )
          })
        }
      </select>
      <span>results per page.</span>
    </div>
  )
}

export default DropDown;