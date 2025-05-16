import React, { useState } from 'react';

import { Tower, allTowers } from '../../assets/towers';

import './Gameboard.css';
const GameBoard = () => {
  const [tiles, setTiles] = useState(() => {
    const initialTiles = {};
    for (let i = 1; i <= 49; i++) {
      initialTiles[i] = {
        hasTower: false,
        tower: null,
      };
    }
    return initialTiles;
  });

  const placeBasicTower = (key) => {
    setTiles(prev => ({
      ...prev,
      [key]: {
        hasTower: true,
        tower: allTowers[0]
      },
    }));
  };

  return (
    <div className="game-board-wrapper">
      <div className="grid-board">
        {Object.entries(tiles).map(([key, tile]) => (
          <div
            key={key}
            className={`tile ${tile.hasTower ? 'with-tower' : 'empty'}`}
            onClick={() => {
              if (!tile.hasTower) placeBasicTower(key);
            }}
          >
            {tile.hasTower && <div className="tower-icon" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
