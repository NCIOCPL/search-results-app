import React from 'react';
import BestBetListItem from './best-bet-list-item';

const BestBet = ({ name, results = [] }) => {
  return (
    <div className="feature-box__bestbet-container">
      <h3>{ name }</h3>
      {
        results.length &&
          (
            <div className="managed list">
              <ul>
                {
                  results.map((listItem, index) => (
                    <BestBetListItem key={ index } resultIndex={ index } { ...listItem } />
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