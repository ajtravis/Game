import React, { useContext, memo, useMemo } from 'react';
import { TowerContext } from '../../context/TowerContext';
import towersObj from '../../assets/towers';
import './TowerBar.css';

const TowerBar = memo(() => {
  const { towerType, setTowerType } = useContext(TowerContext)
  const towers = Object.keys(towersObj)
  
  // Memoize tower info to prevent recreation on every render
  const info = useMemo(() => ({
    'basic': {
      colorClass: 'tower-basic',
      description: 'Balanced attack & range',
      emoji: '🏹',
    },
    'fast': {
      colorClass: 'tower-fast',
      description: 'Low damage, high speed',
      emoji: '⚡',
    },
    'close': {
      colorClass: 'tower-strong',
      description: 'Heavy damage, short range',
      emoji: '💣',
    },
  }), []);
  return (
     
    <div className='tower-bar'>
      
      {towers.map(tower => (
       
        <button key={tower} className={`tower-button ${info[tower]?.colorClass} ${
          towerType == tower ? 'selected' : ''
          } tower-${tower}`} onClick={() => setTowerType(tower)}>
          {tower}
          <div className="emoji">{info[tower]?.emoji}</div>
          <div className="tower-labels">
            <span className="tower-name">{tower} Tower</span>
            <span className="tower-description">{info[tower]?.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
});

TowerBar.displayName = 'TowerBar';

export default TowerBar;
