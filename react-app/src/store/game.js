// Game store for managing money, score, and game state
const ADD_MONEY = 'game/ADD_MONEY';
const SPEND_MONEY = 'game/SPEND_MONEY';
const SET_MONEY = 'game/SET_MONEY';
const ADD_SCORE = 'game/ADD_SCORE';
const RESET_GAME = 'game/RESET_GAME';
const SET_WAVE = 'game/SET_WAVE';
const SET_GAME_SPEED = 'game/SET_GAME_SPEED';
const SET_GAME_STATE = 'game/SET_GAME_STATE';
const ADVANCE_WAVE = 'game/ADVANCE_WAVE';
const SET_ENEMIES_REMAINING = 'game/SET_ENEMIES_REMAINING';
const ENEMY_SPAWNED = 'game/ENEMY_SPAWNED';
const ENEMY_KILLED = 'game/ENEMY_KILLED';
const ENEMY_REACHED_BASE = 'game/ENEMY_REACHED_BASE';
const START_WAVE = 'game/START_WAVE';
const COMPLETE_WAVE = 'game/COMPLETE_WAVE';

// Action creators
export const addMoney = (amount) => ({
    type: ADD_MONEY,
    amount
});

export const spendMoney = (amount) => ({
    type: SPEND_MONEY,
    amount
});

export const setMoney = (amount) => ({
    type: SET_MONEY,
    amount
});

export const addScore = (points) => ({
    type: ADD_SCORE,
    points
});

export const resetGame = () => ({
    type: RESET_GAME
});

export const setWave = (wave) => ({
    type: SET_WAVE,
    wave
});

export const setGameSpeed = (speed) => ({
    type: SET_GAME_SPEED,
    speed
});

export const setGameState = (state) => ({
    type: SET_GAME_STATE,
    gameState: state
});

export const advanceWave = () => ({
    type: ADVANCE_WAVE
});

export const setEnemiesRemaining = (count) => ({
    type: SET_ENEMIES_REMAINING,
    count
});

export const enemySpawned = () => ({
    type: ENEMY_SPAWNED
});

export const enemyKilled = () => ({
    type: ENEMY_KILLED
});

export const enemyReachedBase = () => ({
    type: ENEMY_REACHED_BASE
});

export const startWave = () => ({
    type: START_WAVE
});

export const completeWave = () => ({
    type: COMPLETE_WAVE
});

// Thunk for enemy killed reward
export const thunkEnemyKilled = (enemyType) => (dispatch) => {
    const rewards = {
        basic: 5,
        fast: 3,
        tanky: 8
    };
    
    const reward = rewards[enemyType] || 5;
    dispatch(addMoney(reward));
    dispatch(addScore(reward * 2));
};

const initialState = {
    money: 50,        // Starting money
    score: 0,         // Player score
    wave: 1,          // Current wave
    gameSpeed: 1,     // Game speed multiplier
    gameState: 'preparing', // 'playing', 'paused', 'gameOver', 'victory', 'preparing', 'waveActive'
    isPlaying: false, // Is game currently running
    isPaused: false,  // Is game paused
    enemiesInWave: 10, // Total enemies in current wave
    enemiesSpawned: 0, // Enemies spawned in current wave
    enemiesKilled: 0,  // Enemies killed in current wave
    enemiesRemaining: 0, // Enemies still alive
    maxWaves: 10,     // Total waves to complete for victory
    waveStartTime: null, // When current wave started
    gameStartTime: Date.now(), // When game started
    waveActive: false, // Is the current wave actively spawning enemies
    canStartWave: true // Can the player start the next wave
};

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_MONEY:
            return {
                ...state,
                money: state.money + action.amount
            };
            
        case SPEND_MONEY:
            return {
                ...state,
                money: Math.max(0, state.money - action.amount)
            };
            
        case SET_MONEY:
            return {
                ...state,
                money: Math.max(0, action.amount)
            };
            
        case ADD_SCORE:
            return {
                ...state,
                score: state.score + action.points
            };
            
        case SET_WAVE:
            return {
                ...state,
                wave: action.wave
            };
            
        case SET_GAME_SPEED:
            return {
                ...state,
                gameSpeed: action.speed
            };
            
        case RESET_GAME:
            return {
                ...initialState,
                gameStartTime: Date.now()
            };
            
        case SET_GAME_STATE:
            return {
                ...state,
                gameState: action.gameState,
                isPlaying: action.gameState === 'playing',
                isPaused: action.gameState === 'paused'
            };
            
        case ADVANCE_WAVE:
            const newWave = state.wave + 1;
            const newEnemiesInWave = Math.min(10 + (newWave - 1) * 2, 20); // Increase enemies per wave, cap at 20
            return {
                ...state,
                wave: newWave,
                enemiesInWave: newEnemiesInWave,
                enemiesSpawned: 0,
                enemiesKilled: 0,
                waveStartTime: Date.now(),
                gameState: newWave > state.maxWaves ? 'victory' : 'playing'
            };
            
        case SET_ENEMIES_REMAINING:
            return {
                ...state,
                enemiesRemaining: action.count
            };
            
        case ENEMY_SPAWNED:
            return {
                ...state,
                enemiesSpawned: state.enemiesSpawned + 1
            };
            
        case ENEMY_KILLED:
            const newKilled = state.enemiesKilled + 1;
            const shouldAdvanceWave = newKilled >= state.enemiesInWave && state.enemiesRemaining <= 1;
            return {
                ...state,
                enemiesKilled: newKilled,
                gameState: shouldAdvanceWave && state.wave < state.maxWaves ? 'preparing' : state.gameState
            };
            
        case ENEMY_REACHED_BASE:
            return {
                ...state,
                gameState: 'gameOver'
            };
            
        case START_WAVE:
            return {
                ...state,
                gameState: 'waveActive',
                waveActive: true,
                canStartWave: false,
                isPlaying: true,
                waveStartTime: Date.now()
            };
            
        case COMPLETE_WAVE:
            const nextWave = state.wave + 1;
            const isGameComplete = nextWave > state.maxWaves;
            return {
                ...state,
                gameState: isGameComplete ? 'victory' : 'preparing',
                waveActive: false,
                canStartWave: !isGameComplete,
                isPlaying: !isGameComplete,
                wave: nextWave,
                enemiesInWave: Math.min(10 + (nextWave - 1) * 2, 20),
                enemiesSpawned: 0,
                enemiesKilled: 0
            };
            
        default:
            return state;
    }
}
