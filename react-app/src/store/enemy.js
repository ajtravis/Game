const GET_ENEMIES = '/enemies/GET_ENEMIES'

const getEnemies = (enemies) => ({
	type: GET_ENEMIES,
    enemies
});

export const thunkGetEnemies = () => async (dispatch) => {
	const response = await fetch(`/api/enemies/all`, {
		headers: { "Content-Type": "application/json" },
	})
	// console.log(response, 'this is respond from backend')
	if (response.ok) {
		const data = await response.json();
		// console.log(data, '!!just came from backend')
		dispatch(getEnemies(data));
		return null
		// return response
	}
	else if (response.status < 500) {
		const data = await response.json();
		// console.log(data)
		if (data.errors) return data;
	}
	else return { errors: ["An error occurred. Please try again."] }
}

const initialState = {}
export default function enemyReducer(state = initialState, action) {
	let newState = { ...state }
	switch (action.type) {
		case GET_ENEMIES:
			
			let enemies = action.enemies
			for (let e of enemies) newState[e.id] = e
			return newState
        default:
            return state;
    }
}