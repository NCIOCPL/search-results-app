import React from 'react';
import BestBetListItem from './best-bet-list-item';

const BestBet = ({ name, results = [] }) => {
  return (
    <div>
      <h3>{ name }</h3>
      {
        results.length &&
          (
            <div className="managed list">
              <ul>
                {
                  results.map((listItem, index) => (
                    <BestBetListItem key={ index } { ...listItem } />
                  ))
                }
              </ul>
            </div>
          )
      }
    </div>
  )
};

export default BestBet;