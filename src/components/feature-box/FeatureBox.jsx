import React from 'react';
import { useSelector } from 'react-redux';
import BestBet from './best-bet';
import Dictionary from './dictionary';

const FeatureBox = ({ bestBetsIsVisible }) => {
  const bestBets = useSelector(store => store.results.bestBets);

  if(bestBetsIsVisible && bestBets){
    return bestBets.map((bestBet, bbIndex) => (
      <div key={ bbIndex } className="featured sitewide-results">
        <BestBet { ...bestBet } />
        {
          (bbIndex === 0) &&
            <Dictionary />
        }
      </div>
    ))
  }
  return <Dictionary />
}

export default FeatureBox;