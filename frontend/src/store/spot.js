import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spot/getSpots';

// actions
const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        payload: spots
    }
}

const GET_SPOT_BY_ID = 'spot/getSpotId'

const getSpotById = (spotId) => {
    return {
        type: GET_SPOT_BY_ID,
        payload: spotId
    }
}

const POST_SPOT = 'spot/postSpot'

const createSpot = (spot) => {
    return {
        type: POST_SPOT,
        payload: spot
    }
}

// thunks
export const fetchAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots');

    if (response.ok) {
        const data = await response.json();

        const spots = data.Spots;

        dispatch(getSpots(spots));

        return spots;
    }
}

export const fetchSpotById = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const data = await response.json();


        dispatch(getSpotById(data))

        return data;
    }
}

export const postSpot = (spot) => async dispatch => {
    const response = await csrfFetch('/api/spots',
    {
        method: 'POST',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    });

    if (response.ok) {
        const newSpot = await response.json();

        dispatch(createSpot(newSpot))
        console.log('newSpotThunk', newSpot)
        return newSpot;

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
        case GET_SPOT_BY_ID: {
            return {
                ...state,
                [action.payload.id]: action.payload
            };
        }
        case POST_SPOT: {
            return {
                ...state,
                [action.payload.id]: action.payload
            };
        }
        default:
            return state
    }
}

export default spotReducer
