import { useSelector, shallowEqual } from 'react-redux';
import { useMemo } from 'react';

// Optimized selectors to reduce unnecessary re-renders
export const useGameStats = () => {
  return useSelector(state => ({
    baseHealth: state.base?.baseHp,
    playerMoney: state.game?.money || 0,
    playerScore: state.game?.score || 0,
    currentWave: state.game?.wave || 1,
    enemiesKilled: state.game?.enemiesKilled || 0,
    enemiesInWave: state.game?.enemiesInWave || 10,
    enemiesSpawned: state.game?.enemiesSpawned || 0,
    gameState: state.game?.gameState,
    waveActive: state.game?.waveActive || false,
    canStartWave: state.game?.canStartWave || false
  }), shallowEqual);
};

export const useGameEntities = () => {
  return useSelector(state => ({
    enemies: state.enemies?.active || [],
    towers: state.towers?.placed || {}
  }), shallowEqual);
};

export const useGameControls = () => {
  return useSelector(state => ({
    isGameOver: state.base?.isGameOver,
    health: state.base?.baseHp
  }), shallowEqual);
};

// Memoized selector for frequently accessed data
export const useMemoizedGameData = () => {
  const gameStats = useGameStats();
  const gameEntities = useGameEntities();
  const gameControls = useGameControls();
  
  return useMemo(() => ({
    ...gameStats,
    ...gameEntities,
    ...gameControls
  }), [gameStats, gameEntities, gameControls]);
};
