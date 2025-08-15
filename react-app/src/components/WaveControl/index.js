import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startWave, completeWave } from '../../store/game';
import './WaveControl.css';

const WaveControl = memo(() => {
  const dispatch = useDispatch();
  
  const gameState = useSelector(state => state.game?.gameState);
  const wave = useSelector(state => state.game?.wave || 1);
  const maxWaves = useSelector(state => state.game?.maxWaves || 10);
  const enemiesInWave = useSelector(state => state.game?.enemiesInWave || 10);
  const enemiesSpawned = useSelector(state => state.game?.enemiesSpawned || 0);
  const enemiesKilled = useSelector(state => state.game?.enemiesKilled || 0);
  const enemiesRemaining = useSelector(state => state.game?.enemiesRemaining || 0);
  const canStartWave = useSelector(state => state.game?.canStartWave);
  const waveActive = useSelector(state => state.game?.waveActive);

  const handleStartWave = () => {
    if (canStartWave && !waveActive) {
      dispatch(startWave());
    }
  };

  const handleCompleteWave = () => {
    dispatch(completeWave());
  };

  // Check if wave should be completed (all enemies spawned and killed)
  const isWaveComplete = enemiesSpawned >= enemiesInWave && enemiesRemaining === 0 && enemiesKilled >= enemiesInWave;

  const getWaveStatus = () => {
    if (gameState === 'preparing') {
      return `Wave ${wave} - Ready to Start`;
    } else if (gameState === 'waveActive') {
      return `Wave ${wave} - Active (${enemiesKilled}/${enemiesInWave} defeated)`;
    } else if (gameState === 'victory') {
      return 'All Waves Complete!';
    } else if (gameState === 'gameOver') {
      return 'Game Over';
    }
    return `Wave ${wave}`;
  };

  const getButtonText = () => {
    if (gameState === 'preparing') {
      return `🚀 Start Wave ${wave}`;
    } else if (isWaveComplete && wave < maxWaves) {
      return `➡️ Next Wave (${wave + 1})`;
    } else if (waveActive) {
      return '⚔️ Wave in Progress...';
    }
    return 'Start Wave';
  };

  const shouldShowButton = () => {
    return gameState === 'preparing' || (isWaveComplete && wave < maxWaves);
  };

  const handleButtonClick = () => {
    if (gameState === 'preparing') {
      handleStartWave();
    } else if (isWaveComplete && wave < maxWaves) {
      handleCompleteWave();
    }
  };

  return (
    <div className="wave-control">
      <div className="wave-status">
        <h3 className="wave-title">{getWaveStatus()}</h3>
        {waveActive && (
          <div className="wave-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(enemiesKilled / enemiesInWave) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              Enemies: {enemiesKilled}/{enemiesInWave} | Remaining: {enemiesRemaining}
            </span>
          </div>
        )}
      </div>
      
      {shouldShowButton() && (
        <button 
          className={`wave-button ${gameState === 'preparing' ? 'start-wave' : 'next-wave'}`}
          onClick={handleButtonClick}
          disabled={!canStartWave && gameState === 'preparing'}
        >
          {getButtonText()}
        </button>
      )}

      {isWaveComplete && wave < maxWaves && (
        <div className="wave-complete-message">
          <span className="complete-icon">✅</span>
          <span>Wave {wave} Complete! Ready for next wave.</span>
        </div>
      )}
    </div>
  );
});

WaveControl.displayName = 'WaveControl';

export default WaveControl;
