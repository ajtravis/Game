const RESET_HEALTH = '/base/RESET_HEALTH'
const TAKE_DAMAGE = '/base/TAKE_DAMAGE'
const GAME_OVER = '/base/GAME_OVER'

export const resetHealth = () => ({
	type: RESET_HEALTH,
   
});

export const takeDamage = (dmg) => ({
	type: TAKE_DAMAGE,
    dmg
});

export const setGameOver = (bool) => ({
	type: GAME_OVER,
    bool
});



const initialState = {baseHp: 50, isGameOver : false}
export default function baseReducer(state = initialState, action) {
	let newState = { ...state }
	switch (action.type) {
		case RESET_HEALTH:
			newState.baseHp = 50
            return newState
        case TAKE_DAMAGE:
            newState.baseHp -= action.dmg
            return newState
        case GAME_OVER:
            newState.isGameOver = action.bool
            return newState
        default:
            return state;
    }
}
