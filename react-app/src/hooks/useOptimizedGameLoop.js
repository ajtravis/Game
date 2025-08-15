import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';

// Custom hook for optimized game loop with performance monitoring
export const useOptimizedGameLoop = (gameState, isPlaying) => {
  const dispatch = useDispatch();
  const intervalsRef = useRef({});
  const performanceRef = useRef({
    lastFrameTime: Date.now(),
    frameCount: 0,
    fps: 0
  });

  // Throttled dispatch function to prevent excessive calls
  const throttledDispatch = useCallback((action, delay = 0) => {
    const now = Date.now();
    const key = action.type;
    
    if (!intervalsRef.current[key] || now - intervalsRef.current[key] >= delay) {
      dispatch(action);
      intervalsRef.current[key] = now;
    }
  }, [dispatch]);

  // Performance monitoring
  const updateFPS = useCallback(() => {
    const now = Date.now();
    const delta = now - performanceRef.current.lastFrameTime;
    
    if (delta >= 1000) { // Update FPS every second
      performanceRef.current.fps = Math.round(
        (performanceRef.current.frameCount * 1000) / delta
      );
      performanceRef.current.frameCount = 0;
      performanceRef.current.lastFrameTime = now;
    } else {
      performanceRef.current.frameCount++;
    }
  }, []);

  // Optimized game intervals with different frequencies
  useEffect(() => {
    if (!isPlaying || gameState !== 'playing') return;

    const intervals = [];

    // Enemy spawning - less frequent (every 2 seconds instead of 1)
    const spawnInterval = setInterval(() => {
      throttledDispatch({ type: 'enemies/SPAWN_ENEMY', enemyType: 'basic' }, 2000);
    }, 2000);
    intervals.push(spawnInterval);

    // Enemy movement - moderate frequency (every 600ms instead of 500ms)
    const moveInterval = setInterval(() => {
      throttledDispatch({ type: 'enemies/MOVE_ENEMIES' }, 600);
    }, 600);
    intervals.push(moveInterval);

    // Tower attacks - high frequency but throttled (every 150ms instead of 100ms)
    const attackInterval = setInterval(() => {
      throttledDispatch({ type: 'towers/ATTACK' }, 150);
    }, 150);
    intervals.push(attackInterval);

    // Performance monitoring - low frequency
    const perfInterval = setInterval(updateFPS, 100);
    intervals.push(perfInterval);

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [isPlaying, gameState, throttledDispatch, updateFPS]);

  return {
    fps: performanceRef.current.fps,
    throttledDispatch
  };
};

export default useOptimizedGameLoop;
