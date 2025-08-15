// Tower store for managing placed towers and attacks
import { damageEnemy, removeEnemy } from './enemy';
import { thunkEnemyKilled } from "./game";
import { handleGameError, addError } from "./errors";

const PLACE_TOWER = 'towers/PLACE_TOWER';
const REMOVE_TOWER = 'towers/REMOVE_TOWER';
const TOWER_ATTACK = 'towers/TOWER_ATTACK';
const CLEAR_ALL_TOWERS = 'towers/CLEAR_ALL_TOWERS';

// Action creators
export const placeTower = (tileId, towerType, towerData) => ({
    type: PLACE_TOWER,
    tileId,
    towerType,
    towerData
});

export const removeTower = (tileId) => ({
    type: REMOVE_TOWER,
    tileId
});

export const towerAttack = (towerId, enemyId, damage) => ({
    type: TOWER_ATTACK,
    towerId,
    enemyId,
    damage
});

// Thunk for placing a tower with validation
export const thunkPlaceTower = (tileId, towerType) => (dispatch, getState) => {
    try {
        const state = getState();
        const existingTower = state.towers.placed[tileId];
        const playerMoney = state.game?.money || 0;
        
        // Tower costs
        const towerCosts = {
            basic: 50,
            sniper: 100,
            cannon: 150
        };
        
        const cost = towerCosts[towerType] || 50;
        
        // Validation
        if (existingTower) {
            dispatch(addError({
                title: 'Tower Placement Failed',
                message: 'This tile already has a tower',
                type: 'warning'
            }));
            return false;
        }
        
        if (playerMoney < cost) {
            dispatch(addError({
                title: 'Insufficient Funds',
                message: `Need $${cost} to place ${towerType} tower. You have $${playerMoney}`,
                type: 'warning'
            }));
            return false;
        }
        
        // Tower stats
        const towerStats = {
            basic: { damage: 25, range: 2, attackSpeed: 1000 },
            sniper: { damage: 75, range: 4, attackSpeed: 2000 },
            cannon: { damage: 100, range: 1.5, attackSpeed: 3000 }
        };
        
        const stats = towerStats[towerType] || towerStats.basic;
        
        const towerData = {
            id: Date.now(),
            type: towerType,
            tileId: tileId,
            ...stats,
            lastAttack: 0
        };
        
        dispatch(placeTower(tileId, towerType, towerData));
        dispatch({ type: 'game/SPEND_MONEY', amount: cost });
        
        dispatch(addError({
            title: 'Tower Placed',
            message: `${towerType} tower placed successfully for $${cost}`,
            type: 'info'
        }));
        
        return true;
    } catch (error) {
        dispatch(handleGameError(error, 'place tower'));
        return false;
    }
};

// Thunk for tower attacks
export const thunkTowerAttacks = () => (dispatch, getState) => {
    const state = getState();
    const towers = Object.values(state.towers.placed);
    const enemies = state.enemies.active;
    const currentTime = Date.now();
    
    towers.forEach(tower => {
        // Check if tower can attack (cooldown)
        if (currentTime - tower.lastAttack < tower.attackSpeed) return;
        
        // Calculate tower position from tileId
        const towerRow = Math.floor(tower.tileId / 12);
        const towerCol = tower.tileId % 12;
        
        // Find enemies in range
        const enemiesInRange = enemies.filter(enemy => {
            // Calculate enemy position from tileId
            const enemyRow = Math.floor(enemy.tileId / 12);
            const enemyCol = enemy.tileId % 12;
            
            // Calculate distance between tower and enemy
            const distance = Math.sqrt(
                Math.pow(towerCol - enemyCol, 2) + 
                Math.pow(towerRow - enemyRow, 2)
            );
            
            return distance <= tower.range;
        });
        
        if (enemiesInRange.length > 0) {
            // Attack the first enemy in range
            const target = enemiesInRange[0];
            
            // Update tower's last attack time
            dispatch({
                type: 'towers/UPDATE_LAST_ATTACK',
                tileId: tower.tileId,
                time: currentTime
            });
            
            // Damage the enemy
            dispatch(damageEnemy(target.id, tower.damage));
            
            // Visual feedback could be added here
            dispatch(towerAttack(tower.id, target.id, tower.damage));
        }
    });
};

const initialState = {
    placed: {}, // { [tileId]: towerData }
    attacks: [] // Recent attacks for visual effects
};

export default function towerReducer(state = initialState, action) {
    switch (action.type) {
        case PLACE_TOWER:
            return {
                ...state,
                placed: {
                    ...state.placed,
                    [action.tileId]: action.towerData
                }
            };
            
        case REMOVE_TOWER:
            const newPlaced = { ...state.placed };
            delete newPlaced[action.tileId];
            return {
                ...state,
                placed: newPlaced
            };
            
        case 'towers/UPDATE_LAST_ATTACK':
            return {
                ...state,
                placed: {
                    ...state.placed,
                    [action.tileId]: {
                        ...state.placed[action.tileId],
                        lastAttack: action.time
                    }
                }
            };
            
        case TOWER_ATTACK:
            return {
                ...state,
                attacks: [
                    ...state.attacks.slice(-10), // Keep only last 10 attacks
                    {
                        id: Date.now(),
                        towerId: action.towerId,
                        enemyId: action.enemyId,
                        damage: action.damage,
                        timestamp: Date.now()
                    }
                ]
            };
            
        case CLEAR_ALL_TOWERS:
            return {
                ...state,
                placed: {},
                attacks: []
            };
            
        default:
            return state;
    }
}
