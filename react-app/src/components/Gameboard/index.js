import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { thunkOneTile } from '../../store/tile';
import { thunkMapTiles } from '../../store/map';
import { thunkGetEnemies } from '../../store/enemy';
import { TowerContext } from '../../context/TowerContext';
// import { Tower, allTowers } from '../../assets/towers';
import { generateGameBoard } from '../../assets/getGameBoard';
import { getGameBoard } from '../../assets/maps';
import { to12x12Grid } from './CreateMap';

import TowerBar from '../TowerBar';
import towersObj from '../../assets/towers';
import './Gameboard.css';


const GameBoard = () => {
  const { towerType } = useContext(TowerContext);
  const dispatch = useDispatch();
  const enemies = useSelector(state => state.enemies)
  const enemyList = Object.values(enemies)
  const [nextEnemy, setNextEnemy] = useState(0)
  const [map, setMap] = useState(1)

  const [tiles, setTiles] = useState(() => getGameBoard(0)); // 0-4 for different maps
  const [t, setT] = useState(1)

  const tileList = useSelector(state => Object.values(state.map?.tiles));

  const tileRows = [];
  const width = 12; // or dynamically detect max x + 1
  const height = 12; // or max y + 1

  // for (let y = 0; y < height; y++) {
  //   const row = tileList.filter(tile => tile.y === y).sort((a, b) => a.x - b.x);
  //   tileRows.push(row);
  //   console.log(tileList)
  // }

  // const spawnEnemy = () =>
  // {
  //   let enemy = enemies[nextEnemy]
  //   setNextEnemy(nextEnemy + 1)
  // }
  const grid = to12x12Grid(tileList);
  const changeMap = (id) => {
    setMap(id)
    setTiles(() => getGameBoard((id - 1)))
    console.log(tileList)
  }
  
  useEffect(() => {
    dispatch(thunkGetEnemies())
    dispatch(thunkOneTile(t));
    dispatch(thunkMapTiles(map));
    ;
  }, [dispatch]);

  // const placeTower = (rowIndex, colIndex) => {

  //   setTiles(prev => {
  //     const newTiles = prev.map((row, r) =>
  //       row.map((tile, c) => {
  //         if (r === rowIndex && c === colIndex && !tile.hasTower && !tile.isPath) {
  //           return {
  //             ...tile,
  //             hasTower: true,
  //             tower: towerType
  //           };
  //         }
  //         return tile;
  //       })
  //     );
  //     return newTiles;
  //   });
  // };



  return(
    <>
      <TowerBar
      />
      <div>
        <button onClick={() => changeMap(1)}>
          Map 1
        </button>
        <button onClick={() => changeMap(2)}>
          Map 2
        </button>
        <button onClick={() => changeMap(3)}>
          Map 3
        </button>
        <button onClick={() => changeMap(4)}>
          Map 4
        </button>
        <button onClick={() => changeMap(4)}>
          Map 5
        </button>
      </div>
      <div className="game-board-wrapper">
         <div
        className="grid-board"
        style={{ gridTemplateColumns: 'repeat(12, 32px)' }}
      >
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={tile.id ?? `${rowIndex}-${colIndex}`}
              className={`tile ${tile.is_path ? 'path' : 'empty'}`}
            >
              {/* optional content */}
            </div>
          ))
        )}
      </div>
      </div>
    </>

  );
};

export default GameBoard;
