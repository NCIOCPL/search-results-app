import React from 'react';
import BestBet from './best-bet';
import Dictionary from './dictionary';
import { useBestBets } from '../../utilities/hooks';

const FeatureBox = ({ bestBetsIsVisible }) => {
  const bestBets = useBestBets();

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