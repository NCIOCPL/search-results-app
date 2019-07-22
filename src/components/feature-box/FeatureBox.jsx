import React from 'react';
import { useSelector } from 'react-redux';
import BestBet from './best-bet';
import Dictionary from './dictionary';

const FeatureBox = ({ bestBetsIsVisible }) => {
  const bestBetsCache = useSelector(store => store.cache.bestBets);
  const bestBetsCacheKey = useSelector(store => store.results.bestBets);
  let bestBets = null;
  if(bestBetsCache && bestBetsCacheKey){
    bestBets = bestBetsCache[bestBetsCacheKey];
  };

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