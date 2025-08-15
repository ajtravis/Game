import React, { memo } from 'react';

// Memoized GameStats component to prevent unnecessary re-renders
const GameStats = memo(({ 
  baseHealth, 
  playerMoney, 
  playerScore, 
  currentWave, 
  enemiesKilled, 
  enemiesInWave, 
  towerType 
}) => {
  return (
    <div className="game-stats">
      <h4>Base Health: {baseHealth}</h4>
      <h4>Money: ${playerMoney}</h4>
      <h4>Score: {playerScore}</h4>
      <h4>Wave: {currentWave}</h4>
      <h4>Enemies: {enemiesKilled}/{enemiesInWave}</h4>
      <h4>Selected Tower: {towerType}</h4>
    </div>
  );
});

GameStats.displayName = 'GameStats';

export default GameStats;
