import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { thunkOneTile } from '../../store/tile';
import { thunkMapTiles } from '../../store/map';
import { thunkGetEnemies, thunkMoveEnemies, thunkSpawnEnemy } from '../../store/enemy';
import { thunkPlaceTower, thunkTowerAttacks } from '../../store/tower';
import { setGameOver, resetHealth } from '../../store/base';
import { resetGame } from '../../store/game';
import { TowerContext } from '../../context/TowerContext';
// import { Tower, allTowers } from '../../assets/towers';
import { generateGameBoard } from '../../assets/getGameBoard';
import { getGameBoard } from '../../assets/maps';
import { to12x12Grid } from './CreateMap';
import GameWatcher from './gameWatcher';

import TowerBar from '../TowerBar';
import GameOverModal from '../GameOverModal';
import WaveControl from '../WaveControl';
import Tile from './Tile';
import GameStats from './GameStats';
import { useEnemyLookup } from '../../hooks/useEnemyLookup';
import { useGameStats, useGameEntities } from '../../hooks/useGameSelectors';
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

  // Use optimized selectors to reduce re-renders
  const gameStats = useGameStats();
  const { enemies: active, towers: placedTowers } = useGameEntities();
  const tileList = useSelector(state => Object.values(state.map?.tiles));
  const { protos } = useSelector(s => s.enemies);

  const isGameOver = useSelector(state => state.base?.isGameOver);
  const health = useSelector(state => state.base?.baseHp);


  // Find spawn and base points for a path by analyzing connectivity
  const findSpawnAndBase = (localTiles) => {
    const pathTiles = [];
    
    // Collect all path tiles with their coordinates
    for (let row = 0; row < localTiles.length; row++) {
      for (let col = 0; col < localTiles[row].length; col++) {
        if (localTiles[row][col].isPath) {
          pathTiles.push({ row, col });
        }
      }
    }
    
    if (pathTiles.length === 0) return { spawn: null, base: null };
    
    // Find edge tiles (tiles on the border of the grid)
    const edgeTiles = pathTiles.filter(tile => 
      tile.row === 0 || tile.row === 11 || tile.col === 0 || tile.col === 11
    );
    
    if (edgeTiles.length < 2) {
      return {
        spawn: pathTiles[0],
        base: pathTiles[pathTiles.length - 1]
      };
    }
    
    // Count neighbors for each edge tile to find endpoints
    const getNeighborCount = (tile) => {
      const directions = [[-1,0], [1,0], [0,-1], [0,1]]; // up, down, left, right
      let count = 0;
      
      for (const [dr, dc] of directions) {
        const newRow = tile.row + dr;
        const newCol = tile.col + dc;
        
        if (newRow >= 0 && newRow < 12 && newCol >= 0 && newCol < 12) {
          if (localTiles[newRow][newCol].isPath) {
            count++;
          }
        }
      }
      return count;
    };
    
    // Find edge tiles with only 1 neighbor (endpoints)
    const endpoints = edgeTiles.filter(tile => getNeighborCount(tile) === 1);
    
    let spawn, base;
    
    if (endpoints.length >= 2) {
      // Use actual endpoints - prefer top-left for spawn, bottom-right for base
      spawn = endpoints.reduce((best, current) => {
        const bestScore = best.row + best.col;
        const currentScore = current.row + current.col;
        return currentScore < bestScore ? current : best;
      });
      
      base = endpoints.reduce((best, current) => {
        const bestScore = best.row + best.col;
        const currentScore = current.row + current.col;
        return currentScore > bestScore ? current : best;
      });
    } else {
      // Fallback to edge tiles with coordinate-based selection
      spawn = edgeTiles.reduce((best, current) => {
        const bestScore = best.row + best.col;
        const currentScore = current.row + current.col;
        return currentScore < bestScore ? current : best;
      });
      
      base = edgeTiles.reduce((best, current) => {
        const bestScore = best.row + best.col;
        const currentScore = current.row + current.col;
        return currentScore > bestScore ? current : best;
      });
    }
    
    // Ensure spawn and base are different
    if (spawn.row === base.row && spawn.col === base.col && edgeTiles.length > 1) {
      const alternatives = edgeTiles.filter(tile => 
        !(tile.row === spawn.row && tile.col === spawn.col)
      );
      if (alternatives.length > 0) {
        base = alternatives.reduce((best, current) => {
          const bestScore = best.row + best.col;
          const currentScore = current.row + current.col;
          return currentScore > bestScore ? current : best;
        });
      }
    }
    
    console.log(`Map spawn: (${spawn.row}, ${spawn.col}), base: (${base.row}, ${base.col}), endpoints found: ${endpoints.length}`);
    return { spawn, base };
  };

  // Convert local tiles to proper grid format if available
  const convertLocalTilesToGrid = (localTiles) => {
    if (!localTiles || localTiles.length === 0) return null;
    
    const { spawn, base } = findSpawnAndBase(localTiles);
    
    const grid = localTiles.map((row, rowIndex) => 
      row.map((tile, colIndex) => ({
        id: rowIndex * 12 + colIndex, // Generate unique ID
        x: colIndex,
        y: rowIndex,
        is_path: tile.isPath,
        is_spawn: spawn && spawn.row === rowIndex && spawn.col === colIndex,
        is_base: base && base.row === rowIndex && base.col === colIndex,
        has_tower: tile.hasTower || false,
        map_id: map
      }))
    );
    
    // Validate that we have exactly one spawn and one base
    const flatGrid = grid.flat();
    const spawnCount = flatGrid.filter(tile => tile.is_spawn).length;
    const baseCount = flatGrid.filter(tile => tile.is_base).length;
    
    console.log(`Map ${map} validation - Spawns: ${spawnCount}, Bases: ${baseCount}`);
    
    if (spawnCount !== 1 || baseCount !== 1) {
      console.warn(`Map ${map} has invalid spawn/base count! Spawns: ${spawnCount}, Bases: ${baseCount}`);
    }
    
    return grid;
  };

  // Memoize grid conversion to prevent unnecessary recalculations
  const grid = useMemo(() => {
    return tiles && tiles.length > 0 ? convertLocalTilesToGrid(tiles) : to12x12Grid(tileList);
  }, [tiles, tileList]);
  const changeMap = (id) => {
    console.log('Changing to map:', id);
    setMap(id);
    
    // Get the new map data from static assets
    const newMapData = getGameBoard((id - 1));
    setTiles(() => newMapData);
    
    // Update Redux state with current map ID for enemy pathfinding
    dispatch({ type: 'map/SET_CURRENT_MAP', payload: { id: id - 1 } });
    
    // Clear any existing towers when changing maps
    dispatch({ type: 'towers/CLEAR_ALL_TOWERS' });
    
    // Reset game state for new map
    dispatch(resetGame());
    dispatch(resetHealth());
    
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

  // Initialize Redux map state with current map for enemy pathfinding
  useEffect(() => {
    dispatch({ type: 'map/SET_CURRENT_MAP', payload: { id: map - 1 } });
  }, [dispatch, map]);

  // spawn enemies only when wave is active
  useEffect(() => {
    if (!gameStats.waveActive || gameStats.gameState !== 'waveActive') return;
    
    const id = setInterval(() => {
      // Only spawn if we haven't reached the wave limit
      if (gameStats.enemiesSpawned < gameStats.enemiesInWave) {
        // Find spawn position for current map
        const { spawn } = findSpawnAndBase(tiles);
        const spawnTileId = spawn ? spawn.row * 12 + spawn.col : 1;
        dispatch(thunkSpawnEnemy('basic', spawnTileId));
        dispatch({ type: 'game/ENEMY_SPAWNED' });
      }
    }, 1500); // Spawn every 1.5 seconds when wave is active
    
    return () => clearInterval(id);
  }, [dispatch, gameStats.waveActive, gameStats.gameState, gameStats.enemiesSpawned, gameStats.enemiesInWave]);

  // move enemies every tick
  useEffect(() => {
    const tick = setInterval(() => {
      dispatch(thunkMoveEnemies(map - 1)); // Pass current map ID directly
    }, 500);
    return () => clearInterval(tick);
  }, [dispatch, map]);

  // tower attacks every tick
  useEffect(() => {
    const attackTick = setInterval(() => {
      dispatch(thunkTowerAttacks());
    }, 100); // Check for attacks more frequently
    return () => clearInterval(attackTick);
  }, [dispatch]);

  useEffect(() => {
    // Load initial map on component mount
    if (!tiles || tiles.length === 0) {
      const initialMapData = getGameBoard(0); // Load map 1 by default
      setTiles(() => initialMapData);
    }
    dispatch(thunkOneTile(t));
    // Don't call thunkMapTiles since we're using static data
  }, [dispatch]);

  // Memoized tower placement function
  const placeTower = useCallback((tileId) => {
    const success = dispatch(thunkPlaceTower(tileId, towerType));
    if (!success) {
      console.log('Cannot place tower here');
    }
  }, [dispatch, towerType]);

  // Optimized enemy lookup for O(1) access instead of O(n) filtering
  const enemyLookup = useEnemyLookup(active);



  const handleGameRestart = () => {
    // Reset to map 1 when restarting
    setMap(1);
    const initialMapData = getGameBoard(0);
    setTiles(() => initialMapData);
  };

  return (
    <>
    <GameWatcher/>
      <TowerBar
      />
      <GameOverModal onRestart={handleGameRestart} />
      <WaveControl />
      <div className="map-selector">
        <h4>Select Map:</h4>
        <div className="map-buttons">
          {[1, 2, 3, 4, 5].map(mapId => (
            <button 
              key={mapId}
              className={`map-button ${map === mapId ? 'active' : ''}`}
              onClick={() => changeMap(mapId)}
            >
              Map {mapId}
            </button>
          ))}
        </div>
      </div>
      <div className="game-board-wrapper">
        <GameStats
          baseHealth={gameStats.baseHealth}
          playerMoney={gameStats.playerMoney}
          playerScore={gameStats.playerScore}
          currentWave={gameStats.currentWave}
          enemiesKilled={gameStats.enemiesKilled}
          enemiesInWave={gameStats.enemiesInWave}
          towerType={towerType}
        />
        <div
          className="grid-board"
          style={{ gridTemplateColumns: 'repeat(12, 32px)' }}
        >
          {grid.map((row, r) =>
            row.map(tile => {
              const tileEnemies = enemyLookup[tile.id] || [];
              const tower = placedTowers[tile.id];
              return (
                <Tile
                  key={tile.id}
                  tile={tile}
                  tower={tower}
                  enemies={tileEnemies}
                  onTileClick={placeTower}
                />
              );
            })
          )}
        </div>
      </div>
    </>

  );
};

export default GameBoard;
