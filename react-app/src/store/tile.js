const GET_TILE = '/tiles/GET_TILE'

const getTile = (tile) => ({
	type: GET_TILE,
	tile,
});

export const thunkOneTile = (id) => async (dispatch) => {
	const response = await fetch(`/api/tiles/${id}`, {
		headers: { "Content-Type": "application/json" },
	})
	// console.log(response, 'this is respond from backend')
	if (response.ok) {
		const data = await response.json();
		// console.log(data, '!!just came from backend')
		dispatch(getTile(data));
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
export default function tilesReducer(state = initialState, action) {
	let newState = { ...state }
	switch (action.type) {
		case getTile:
			let t = action.product
			// console.log(one, 'this is the reducer')
			newState.oneTile = t
			return newState
        default:
            return state;
    }
}
