// Game store for managing money, score, and game state
const ADD_MONEY = 'game/ADD_MONEY';
const SPEND_MONEY = 'game/SPEND_MONEY';
const SET_MONEY = 'game/SET_MONEY';
const ADD_SCORE = 'game/ADD_SCORE';
const RESET_GAME = 'game/RESET_GAME';
const SET_WAVE = 'game/SET_WAVE';
const SET_GAME_SPEED = 'game/SET_GAME_SPEED';

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
    isPlaying: false, // Is game currently running
    isPaused: false   // Is game paused
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
                ...initialState
            };
            
        default:
            return state;
    }
}
