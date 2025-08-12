// Tower store for managing placed towers and attacks
import { damageEnemy, removeEnemy } from './enemy';

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
    const state = getState();
    const tile = state.map.tiles[tileId];
    const existingTower = state.towers.placed[tileId];
    const playerMoney = state.game.money;
    
    // Tower costs
    const towerCosts = {
        basic: 10,
        fast: 15,
        close: 20
    };
    
    const cost = towerCosts[towerType] || 10;
    
    // Validation
    if (!tile) return false;
    if (tile.is_path || tile.is_spawn || tile.is_base) return false;
    if (existingTower) return false;
    if (playerMoney < cost) return false;
    
    // Tower stats
    const towerStats = {
        basic: { damage: 5, range: 2, attackSpeed: 1000 }, // 1 second
        fast: { damage: 2, range: 2, attackSpeed: 300 },   // 0.3 seconds
        close: { damage: 15, range: 1, attackSpeed: 1500 } // 1.5 seconds
    };
    
    const stats = towerStats[towerType];
    const towerData = {
        id: `tower_${tileId}_${Date.now()}`,
        type: towerType,
        tileId,
        damage: stats.damage,
        range: stats.range,
        attackSpeed: stats.attackSpeed,
        lastAttack: 0
    };
    
    dispatch(placeTower(tileId, towerType, towerData));
    dispatch({ type: 'game/SPEND_MONEY', amount: cost });
    
    return true;
};

// Thunk for tower attacks
export const thunkTowerAttacks = () => (dispatch, getState) => {
    const state = getState();
    const towers = Object.values(state.towers.placed);
    const enemies = state.enemies.active;
    const tiles = state.map.tiles;
    const currentTime = Date.now();
    
    towers.forEach(tower => {
        // Check if tower can attack (cooldown)
        if (currentTime - tower.lastAttack < tower.attackSpeed) return;
        
        const towerTile = tiles[tower.tileId];
        if (!towerTile) return;
        
        // Find enemies in range
        const enemiesInRange = enemies.filter(enemy => {
            const enemyTile = tiles[enemy.tileId];
            if (!enemyTile) return false;
            
            // Calculate distance between tower and enemy
            const distance = Math.sqrt(
                Math.pow(towerTile.x - enemyTile.x, 2) + 
                Math.pow(towerTile.y - enemyTile.y, 2)
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
