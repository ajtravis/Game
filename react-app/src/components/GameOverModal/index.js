import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame, setGameState } from '../../store/game';
import { resetHealth } from '../../store/base';
import './GameOverModal.css';

const GameOverModal = ({ onRestart }) => {
  const dispatch = useDispatch();
  
  // All useSelector hooks must be called before any conditional logic
  const gameState = useSelector(state => state.game?.gameState);
  const wave = useSelector(state => state.game?.wave || 1);
  const score = useSelector(state => state.game?.score || 0);
  const enemiesKilled = useSelector(state => state.game?.enemiesKilled || 0);
  const maxWaves = useSelector(state => state.game?.maxWaves || 10);
  const gameStartTime = useSelector(state => state.game?.gameStartTime);

  // Early return after all hooks are called
  if (gameState !== 'gameOver' && gameState !== 'victory') {
    return null;
  }

  const isVictory = gameState === 'victory';
  const gameTime = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;

  const handleRestart = () => {
    // Reset all game state
    dispatch(resetGame());
    dispatch(resetHealth());
    dispatch({ type: 'towers/CLEAR_ALL_TOWERS' });
    dispatch({ type: 'enemies/CLEAR_ALL_ENEMIES' });
    dispatch(setGameState('playing'));
    
    // Call parent restart function if provided
    if (onRestart) {
      onRestart();
    }
  };

  const handleMainMenu = () => {
    // For now, just restart - could navigate to main menu in future
    handleRestart();
  };

  return (
    <div className="game-over-overlay">
      <div className={`game-over-modal ${isVictory ? 'victory' : 'defeat'}`}>
        <div className="modal-header">
          <h1 className="modal-title">
            {isVictory ? '🎉 VICTORY!' : '💀 GAME OVER'}
          </h1>
          <p className="modal-subtitle">
            {isVictory 
              ? `Congratulations! You survived all ${maxWaves} waves!`
              : 'Your base has been destroyed!'
            }
          </p>
        </div>

        <div className="game-stats-summary">
          <div className="stat-row">
            <span className="stat-label">Wave Reached:</span>
            <span className="stat-value">{wave} / {maxWaves}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Final Score:</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Enemies Defeated:</span>
            <span className="stat-value">{enemiesKilled}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Time Survived:</span>
            <span className="stat-value">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn btn-primary"
            onClick={handleRestart}
          >
            🔄 Play Again
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleMainMenu}
          >
            🏠 Main Menu
          </button>
        </div>

        <div className="performance-rating">
          {isVictory ? (
            <div className="rating victory-rating">
              <h3>⭐ TOWER DEFENSE MASTER! ⭐</h3>
              <p>You've proven your strategic prowess!</p>
            </div>
          ) : (
            <div className="rating defeat-rating">
              <h3>
                {wave >= maxWaves * 0.8 ? '🥉 Good Effort!' : 
                 wave >= maxWaves * 0.5 ? '🥈 Not Bad!' : 
                 '🥇 Keep Trying!'}
              </h3>
              <p>
                {wave >= maxWaves * 0.8 ? 'You almost made it to the end!' :
                 wave >= maxWaves * 0.5 ? 'You\'re getting the hang of it!' :
                 'Practice makes perfect!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
