import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { thunkOneTile } from '../../store/tile';
import { thunkMapTiles } from '../../store/map';
import { thunkGetEnemies, thunkMoveEnemies, thunkSpawnEnemy } from '../../store/enemy';
import { TowerContext } from '../../context/TowerContext';
// import { Tower, allTowers } from '../../assets/towers';
import { generateGameBoard } from '../../assets/getGameBoard';
import { getGameBoard } from '../../assets/maps';
import { to12x12Grid } from './CreateMap';
import GameWatcher from './gameWatcher';

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
  const { protos, active } = useSelector(s => s.enemies);
  const baseHealth = useSelector(state => state.base?.baseHp)

  const isGameOver = useSelector(state => state.base?.isGameOver);
  const health = useSelector(state => state.base?.health);


  const grid = to12x12Grid(tileList);
  const changeMap = (id) => {
    setMap(id)
    setTiles(() => getGameBoard((id - 1)))
    console.log(tileList)
  }

  useEffect(() => {
    if (health <= 0) {
      dispatch(setGameOver(true));

      // You could also trigger a modal, animation, etc. here
    }
  }, [health, dispatch]);

  useEffect(() => {
    dispatch(thunkGetEnemies());
  }, [dispatch,]);

  // fetch protos
  useEffect(() => {
    dispatch(thunkGetEnemies());
  }, [dispatch,]);

  // spawn a new enemy every 3s
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(thunkSpawnEnemy('basic')); // or cycle types
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  // move enemies every tick
  useEffect(() => {
    const tick = setInterval(() => {
      dispatch(thunkMoveEnemies());
    }, 500);
    return () => clearInterval(tick);
  }, [dispatch]);

  useEffect(() => {
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



  return (
    <>
    <GameWatcher/>
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
        <h4>Base: {baseHealth}</h4>
        <div
          className="grid-board"
          style={{ gridTemplateColumns: 'repeat(12, 32px)' }}
        >
          {grid.map((row, r) =>
            row.map(tile => {
              const here = active.filter(e => e.tileId === tile.id);
              return (
                <div key={tile.id} className={`${tile.id} tile ${tile.is_path ? 'path' : 'empty'} ${tile.is_spawn ? 'spawn' : ''} ${tile.is_base ? 'base' : ''}`}>
                  {/* {tile.id} */}
                  {here.map(e => (
                    <div key={e.id} className={`enemy enemy-${e.type}`} />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>

  );
};

export default GameBoard;
