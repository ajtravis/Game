import React, { useState, useContext } from 'react';
import { TowerContext } from '../../context/TowerContext';
// import { Tower, allTowers } from '../../assets/towers';
import { generateGameBoard } from '../../assets/getGameBoard';
import { getGameBoard } from '../../assets/maps';
import TowerBar from '../TowerBar';
import towersObj from '../../assets/towers';
import './Gameboard.css';


const GameBoard = () => {
  const { towerType } = useContext(TowerContext);
  const [selectedTowerIndex, setSelectedTowerIndex] = useState(0);
  const [tiles, setTiles] = useState(() => getGameBoard(4)); // 0-4 for different maps


  const placeTower = (rowIndex, colIndex) => {
    
    setTiles(prev => {
      const newTiles = prev.map((row, r) =>
        row.map((tile, c) => {
          if (r === rowIndex && c === colIndex && !tile.hasTower) {
            return {
              ...tile,
              hasTower: true,
              tower: towerType
            };
          }
          return tile;
        })
      );
      return newTiles;
    });
  };

  

  return (
    <>
    <TowerBar
      selectedTowerIndex={selectedTowerIndex}
      setSelectedTowerIndex={setSelectedTowerIndex}
    />
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
                ${tile.hasTower ? 'with-tower' : ''}`
              }
              onClick={() => placeTower(rowIndex, colIndex)} // place basic tower
            >
              {tile.hasTower && <div className={`tower-icon + ${tile.tower}`} />}
            </div>
          ))
        )}
      </div>
    </div>
    </>
    
  );
};

export default GameBoard;
