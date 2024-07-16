import { csrfFetch } from './csrf.js';

// case
const GET_SPOTS = 'spot/getSpots';

// actions
const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        payload: spots
    }
}

// thunks
export const fetchAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok) {
        const data = await response.json();

        const spots = data.Spots;

        dispatch(getSpots(spots));

        return spots
    }
}

const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = {...state};
            action.payload.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState;
        }
        default:
            return state
    }
}

export default spotReducer
