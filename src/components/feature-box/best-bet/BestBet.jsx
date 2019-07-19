import React from 'react';
import BestBetListItem from './best-bet-list-item';

const BestBet = ({ children, listItems = [] }) => {
  return (
    <div>
      <h3>Best Bet Header</h3>
      {
        listItems.length &&
          (
            <ul>
              {
                listItems.map((listItem, index) => (
                  <BestBetListItem key={ index } { ...listItem } />
                ))
              }
            </ul>
          )
      }
      { children }
    </div>
  )
};

export default BestBet;