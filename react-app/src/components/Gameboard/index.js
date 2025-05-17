import React, { useState } from 'react';
import { Tower, allTowers } from '../../assets/towers';
import { generateGameBoard } from '../../assets/getGameBoard';
import { getGameBoard } from '../../assets/maps';
import './Gameboard.css';

const GameBoard = () => {
  
  const [tiles, setTiles] = useState(() => getGameBoard(4)); // 0-4 for different maps

  const placeTower = (rowIndex, colIndex, towerTypeIndex) => {
    setTiles(prev => {
      const newTiles = prev.map((row, r) =>
        row.map((tile, c) => {
          if (r === rowIndex && c === colIndex && !tile.hasTower) {
            return {
              ...tile,
              hasTower: true,
              tower: allTowers[towerTypeIndex]
            };
          }
          return tile;
        })
      );
      return newTiles;
    });
  };

  return (
    <div className="game-board-wrapper">
      <div
        className="grid-board"
        style={{ gridTemplateColumns: `repeat(${tiles[0].length}, 32px)` }}
      >
        {tiles.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`tile 
                ${tile.isPath ? 'path' : 'empty'} 
                ${tile.hasTower ? 'with-tower' : ''}`}
              onClick={() => placeTower(rowIndex, colIndex, 0)} // place basic tower
            >
              {tile.hasTower && <div className="tower-icon" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
