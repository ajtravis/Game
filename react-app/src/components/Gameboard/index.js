import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { thunkOneTile } from '../../store/tile';
import { thunkMapTiles } from '../../store/map';
import { thunkGetEnemies, thunkMoveEnemies, thunkSpawnEnemy } from '../../store/enemy';
import { thunkPlaceTower, thunkTowerAttacks } from '../../store/tower';
import { setGameOver } from '../../store/base';
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
  const baseHealth = useSelector(state => state.base?.baseHp);
  const placedTowers = useSelector(state => state.towers?.placed || {});
  const playerMoney = useSelector(state => state.game?.money || 0);
  const playerScore = useSelector(state => state.game?.score || 0);

  const isGameOver = useSelector(state => state.base?.isGameOver);
  const health = useSelector(state => state.base?.baseHp);


  const grid = to12x12Grid(tileList);
  const changeMap = (id) => {
    console.log('Changing to map:', id);
    setMap(id);
    
    // Get the new map data from the static assets
    const newMapData = getGameBoard((id - 1));
    setTiles(() => newMapData);
    
    // Clear any existing towers when changing maps
    // This prevents towers from previous maps from staying
    // We'll need to add this action to the tower store
    dispatch({ type: 'towers/CLEAR_ALL_TOWERS' });
    
    // Reset game state for new map
    dispatch({ type: 'game/RESET_GAME' });
    dispatch({ type: 'base/RESET_HEALTH' });
    
    // Clear any active enemies
    dispatch({ type: 'enemies/CLEAR_ALL_ENEMIES' });
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

  // tower attacks every tick
  useEffect(() => {
    const attackTick = setInterval(() => {
      dispatch(thunkTowerAttacks());
    }, 100); // Check for attacks more frequently
    return () => clearInterval(attackTick);
  }, [dispatch]);

  useEffect(() => {
    dispatch(thunkOneTile(t));
    dispatch(thunkMapTiles(map));
    ;
  }, [dispatch]);

  // Tower placement function
  const placeTower = (tileId) => {
    const success = dispatch(thunkPlaceTower(tileId, towerType));
    if (!success) {
      console.log('Cannot place tower here');
    }
  };



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
        <button onClick={() => changeMap(5)}>
          Map 5
        </button>
      </div>
      <div className="game-board-wrapper">
        <div className="game-stats">
          <h4>Base Health: {baseHealth}</h4>
          <h4>Money: ${playerMoney}</h4>
          <h4>Score: {playerScore}</h4>
          <h4>Selected Tower: {towerType}</h4>
        </div>
        <div
          className="grid-board"
          style={{ gridTemplateColumns: 'repeat(12, 32px)' }}
        >
          {grid.map((row, r) =>
            row.map(tile => {
              const here = active.filter(e => e.tileId === tile.id);
              const tower = placedTowers[tile.id];
              return (
                <div 
                  key={tile.id} 
                  className={`${tile.id} tile ${tile.is_path ? 'path' : 'empty'} ${tile.is_spawn ? 'spawn' : ''} ${tile.is_base ? 'base' : ''} ${tower ? 'has-tower' : ''}`}
                  onClick={() => !tile.is_path && !tile.is_spawn && !tile.is_base && !tower && placeTower(tile.id)}
                  style={{ cursor: (!tile.is_path && !tile.is_spawn && !tile.is_base && !tower) ? 'pointer' : 'default' }}
                >
                  {/* Show tower if placed */}
                  {tower && (
                    <div className={`tower tower-${tower.type}`}>
                      T
                    </div>
                  )}
                  {/* Show enemies */}
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
