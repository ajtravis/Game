import { useMemo } from 'react';

// Custom hook to create an optimized enemy lookup map
export const useEnemyLookup = (enemies) => {
  return useMemo(() => {
    const enemyMap = {};
    
    // Group enemies by tileId for O(1) lookup instead of O(n) filtering
    enemies.forEach(enemy => {
      if (!enemyMap[enemy.tileId]) {
        enemyMap[enemy.tileId] = [];
      }
      enemyMap[enemy.tileId].push(enemy);
    });
    
    return enemyMap;
  }, [enemies]);
};

export default useEnemyLookup;
