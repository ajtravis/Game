// const GET_ENEMIES = '/enemies/GET_ENEMIES'

import { takeDamage } from "./base";
import { thunkEnemyKilled } from "./game";

// const getEnemies = (enemies) => ({
// 	type: GET_ENEMIES,
//     enemies
// });

// export const thunkGetEnemies = () => async (dispatch) => {
// 	const response = await fetch(`/api/enemies/all`, {
// 		headers: { "Content-Type": "application/json" },
// 	})
// 	// console.log(response, 'this is respond from backend')
// 	if (response.ok) {
// 		const data = await response.json();
// 		// console.log(data, '!!just came from backend')
// 		dispatch(getEnemies(data));
// 		return null
// 		// return response
// 	}
// 	else if (response.status < 500) {
// 		const data = await response.json();
// 		// console.log(data)
// 		if (data.errors) return data;
// 	}
// 	else return { errors: ["An error occurred. Please try again."] }
// }

// const initialState = {}
// export default function enemyReducer(state = initialState, action) {
// 	let newState = { ...state }
// 	switch (action.type) {
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


export const loadEnemies = (protos) => ({ type: LOAD_ENEMIES, protos });
export const spawnEnemy = (enemy) => ({ type: SPAWN_ENEMY, enemy });
export const moveEnemies = (updatedList) => ({ type: MOVE_ENEMIES, enemies: updatedList });
export const damageEnemy = (id, amount) => ({ type: DAMAGE_ENEMY, id, amount });
export const removeEnemy = (id) => ({ type: REMOVE_ENEMY, id });



export const thunkGetEnemies = () => async (dispatch) => {
	const res = await fetch('/api/enemies/prototypes');
	if (res.ok) {
		const data = await res.json(); // e.g. { basic: {...}, fast: {...}, tanky: {...} }
		dispatch(loadEnemies(data));
	}
};

export const thunkSpawnEnemy = (type) => (dispatch, getState) => {
	const protos = getState().enemies.protos;
	const proto = protos[type];
	if (!proto) return;

	const state = getState();
	const spawn = state.map?.spawn
	const nt = state.map.tiles[spawn].next_tile
	console.log(nt)
	dispatch(spawnEnemy({
		id: Date.now(),       // unique
		type,
		tileId: spawn,
		dmg: 10,
		hp: proto.health,
		next_tile: nt
	}));
};

export const thunkMoveEnemies = () => async (dispatch, getState) => {
	const state = getState();
	const base = state.map?.base;
	const tilesById = state.map.tiles;    // assume this is an object { [tileId]: tileObj }
	const active = state.enemies.active;  // array of enemy instances
	console.log(active, "PPPPPPPPPPPPPPPPPPPPP")

	const updated = active.map(enemy => {
			const currentTile = tilesById[enemy.tileId];
			if (currentTile.next_tile == base){
				dispatch(takeDamage(enemy.dmg))
				dispatch(removeEnemy(enemy.id));
				return null;
			}
			else if (!currentTile || !currentTile.next_tile) return null;  // reached end or error
			
			
			else {
				enemy.tileId = currentTile.next_tile
				return {
					...enemy
				};}
		})
		.filter(e => e !== null);
	
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
					// Dispatch reward for killed enemy (this will be handled by middleware)
					setTimeout(() => {
						window.store?.dispatch(thunkEnemyKilled(enemy.type));
					}, 0);
				});
				
				return {
					...state,
					active: updatedEnemies.filter(e => e.hp > 0)
				};

		case REMOVE_ENEMY:
			return {
				...state,
				active: state.active.filter(e => e.id !== action.id)
			};
				
		default:
			return state;
			}
	}