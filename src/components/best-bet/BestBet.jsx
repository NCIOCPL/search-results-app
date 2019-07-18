import React from 'react';

const BestBet = props => {
  return (
    <div>
      <p>Best Bet</p>
      { props.children }
    </div>
  )
};

export default BestBet;