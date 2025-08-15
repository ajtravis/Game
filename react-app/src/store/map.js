const GET_MAP_TILES = '/maps/GET_MAP_TITLES'
const CHANGE_MAP = '/maps/CHANGE_MAP'
const SET_CURRENT_MAP = '/maps/SET_CURRENT_MAP'

const getMapTiles = (map) => ({
	type: GET_MAP_TILES,
    map
});

// const changeMap = (mapId) => ({
// 	type: GET_MAP_TILES,
//     mapId
// });

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

const initialState = {id: null, tiles: {}, spawn: null}
export default function mapReducer(state = initialState, action) {
	let newState = { ...state }
	switch (action.type) {
		case GET_MAP_TILES:
			newState.id = action.map.id;
			newState.spawn = action.map.spawn
			newState.tiles = {}
			let tiles = action.map.tiles;
			for (let t of tiles) newState.tiles[t.id] = t;
			return newState;
		case SET_CURRENT_MAP:
			newState.id = action.payload.id;
			return newState;
        default:
            return state;
    }
}
