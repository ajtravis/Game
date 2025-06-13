const GET_MAP_TILES = '/maps/GET_MAP_TITLES'

const getMapTiles = (map) => ({
	type: GET_MAP_TILES,
    map
});

export const thunkMapTiles = (id) => async (dispatch) => {
	const response = await fetch(`/api/maps/${id}`, {
		headers: { "Content-Type": "application/json" },
	})
	// console.log(response, 'this is respond from backend')
	if (response.ok) {
		const data = await response.json();
		// console.log(data, '!!just came from backend')
		dispatch(getMapTiles(data));
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
export default function mapReducer(state = initialState, action) {
	let newState = { ...state }
	switch (action.type) {
		case getMapTiles:
			let tiles = action.map
			for (let t of tiles) newState[t.id] = t
			return newState
        default:
            return state;
    }
}
