// const GET_ENEMIES = '/enemies/GET_ENEMIES'

import { takeDamage } from './base';
import { enemyKilled, enemyReachedBase, setEnemiesRemaining } from './game';
import { handleApiError } from './errors';
import { thunkEnemyKilled } from "./game";

const getEnemies = (enemies) => ({
	type: 'enemies/LOAD',
	protos: enemies
});

export const thunkGetEnemies = () => async (dispatch) => {
	try {
		const response = await fetch(`/api/enemies/prototypes`, {
			headers: { "Content-Type": "application/json" },
		});

		if (response.ok) {
			const data = await response.json();
			dispatch(getEnemies(data));
			return null;
		} else {
			const errorData = await response.json();
			dispatch(handleApiError({
				response: { status: response.status, data: errorData }
			}, 'Enemy Loading'));
			return errorData;
		}
	} catch (error) {
		dispatch(handleApiError(error, 'Enemy Loading'));
		return { errors: ["Failed to load enemy data"] };
	}
};

// 		case GET_ENEMIES:
// 			let enemies = action.enemies
// 			for (let e of enemies) newState[e.id] = e
// 			return newState
//         default:
//             return state;
//     }
// }
const LOAD_ENEMIES = 'enemies/LOAD';
const SPAWN_ENEMY = 'enemies/SPAWN';
const MOVE_ENEMIES = 'enemies/MOVE';
const DAMAGE_ENEMY = 'enemies/DAMAGE';
const REMOVE_ENEMY = 'enemies/REMOVE';
const CLEAR_ALL_ENEMIES = 'enemies/CLEAR_ALL_ENEMIES';


export const loadEnemies = (protos) => ({ type: LOAD_ENEMIES, protos });
export const spawnEnemy = (enemy) => ({ type: SPAWN_ENEMY, enemy });
export const moveEnemies = (updatedList) => ({ type: MOVE_ENEMIES, enemies: updatedList });
export const damageEnemy = (id, amount) => ({ type: DAMAGE_ENEMY, id, amount });
export const removeEnemy = (id) => ({ type: REMOVE_ENEMY, id });



// Removed duplicate thunkGetEnemies function - using the enhanced version above

export const thunkSpawnEnemy = (type, spawnTileId = 1) => async (dispatch, getState) => {
	const protos = {
		basic: { health: 100, speed: 1 },
		fast: { health: 50, speed: 2 },
		tank: { health: 200, speed: 0.5 }
	};
	const proto = protos[type];
	if (!proto) return;

	// Use the passed spawn position instead of Redux state
	dispatch(spawnEnemy({
		id: Date.now(),       // unique
		type,
		tileId: spawnTileId,  // Use passed spawn position
		previousTileId: null, // No previous tile when spawning
		dmg: 10,
		hp: proto.health
		// Removed next_tile since we're using static map movement
	}));
};

// Helper function to find the next tile in the path
const findNextTileInPath = (currentTileId, previousTileId, mapData, gridWidth = 12) => {
	const currentRow = Math.floor(currentTileId / gridWidth);
	const currentCol = currentTileId % gridWidth;
	
	// Define possible directions (up, right, down, left)
	const directions = [
		[-1, 0], // up
		[0, 1],  // right
		[1, 0],  // down
		[0, -1]  // left
	];
	
	const validNextTiles = [];
	
	// Check each direction for a valid path tile
	for (const [deltaRow, deltaCol] of directions) {
		const newRow = currentRow + deltaRow;
		const newCol = currentCol + deltaCol;
		
		// Check bounds
		if (newRow >= 0 && newRow < mapData.length && newCol >= 0 && newCol < mapData[0].length) {
			// Check if it's a path tile
			if (mapData[newRow][newCol] === 'P') {
				const newTileId = newRow * gridWidth + newCol;
				
				// Don't go back to the previous tile (avoid backtracking)
				if (newTileId !== previousTileId) {
					validNextTiles.push(newTileId);
				}
			}
		}
	}
	
	// If we have valid options, prefer the first one (this creates consistent movement)
	// In a more advanced system, we'd use proper pathfinding algorithms
	return validNextTiles.length > 0 ? validNextTiles[0] : null;
};

export const thunkMoveEnemies = (mapId = 0) => async (dispatch, getState) => {
	const state = getState();
	const active = state.enemies.active;  // array of enemy instances
	const currentMapId = mapId; // Use passed map ID instead of Redux state
	
	// Debug logging
	console.log('Enemy pathfinding - Using map ID:', currentMapId);
	console.log('Map ID passed from component:', mapId);
	
	// Import map data - we need to get this from the static maps
	const { getGameBoard } = await import('../assets/maps.js');
	const mapData = getGameBoard(currentMapId);
	
	// Convert board data to simple path array for easier processing
	const rawMapData = mapData.map(row => 
		row.map(cell => cell.isPath ? 'P' : '.')
	);
	
	// Debug the first few rows of the map data
	console.log('Using map data for pathfinding:', rawMapData.slice(0, 3));
	
	const updated = active.map(enemy => {
		// Find the next tile in the path, avoiding backtracking
		const nextTileId = findNextTileInPath(
			enemy.tileId, 
			enemy.previousTileId || enemy.tileId - 1, 
			rawMapData
		);
		
		if (nextTileId === null) {
			// Enemy reached the end (base) or got stuck
			dispatch(takeDamage(enemy.dmg));
			dispatch(enemyReachedBase());
			return null; // Remove enemy
		}
		
		return {
			...enemy,
			previousTileId: enemy.tileId, // Track where we came from
			tileId: nextTileId
		};
	})
	.filter(e => e !== null);
	
	// Update enemies remaining count
	dispatch(setEnemiesRemaining(updated.length));
	dispatch(moveEnemies(updated));
};
const initialState = {
	protos: {},    // { basic: {...}, fast: {...}, tanky: {...} }
	active: []     // will hold { id, type, tileId, hp } entries
};

export default function enemyReducer(state = initialState, action) {
	let newState = { ...state }
	switch (action.type) {
		case LOAD_ENEMIES:
			let enemies = action.protos
			newState.protos = enemies
			return newState
		case SPAWN_ENEMY:
			const newEnemy = action.enemy
			console.log("LLLLLLLLLLLLLLLLL", newEnemy)
			return {
				...state,
				active: [...state.active, newEnemy]
			};


		case MOVE_ENEMIES:
			let updated = action.enemies
			newState.active = updated
			return newState;
		case DAMAGE_ENEMY:
				const updatedEnemies = state.active.map(e => 
					e.id === action.id ? { ...e, hp: e.hp - action.amount } : e
				);
				
				// Find killed enemies and reward player
				const killedEnemies = updatedEnemies.filter(e => e.hp <= 0);
				killedEnemies.forEach(enemy => {
					// Dispatch reward for killed enemy and update game state
					setTimeout(() => {
						window.store?.dispatch(thunkEnemyKilled(enemy.type));
						window.store?.dispatch(enemyKilled());
					}, 0);
				});
				
				const aliveEnemies = updatedEnemies.filter(e => e.hp > 0);
				
				// Update enemies remaining count
				setTimeout(() => {
					window.store?.dispatch(setEnemiesRemaining(aliveEnemies.length));
				}, 0);
				
				return {
					...state,
					active: aliveEnemies
				};

		case REMOVE_ENEMY:
			return {
				...state,
				active: state.active.filter(e => e.id !== action.id)
			};

		case CLEAR_ALL_ENEMIES:
			return {
				...state,
				active: []
			};
				
		default:
			return state;
			}
	}