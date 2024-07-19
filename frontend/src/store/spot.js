import { csrfFetch } from "./csrf";

const GET_SPOTS = "spot/getSpots";

// actions
const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        payload: spots,
    };
};

const GET_SPOT_BY_ID = "spot/getSpotId";

const getSpotById = (spot) => {
    return {
        type: GET_SPOT_BY_ID,
        payload: spot,
    };
};

const POST_SPOT = "spot/postSpot";

const createSpot = (spot) => {
    return {
        type: POST_SPOT,
        payload: spot,
    };
};

const EDIT_SPOT = "spot/editSpot";

const updateSpot = (spot) => {
    return {
        type: EDIT_SPOT,
        payload: spot,
    };
};

const GET_SPOT_BY_CURRENT_USER = "spot/getSpotByCurrentUser";

const getSpotByCurrentUser = (spots) => {
    return {
        type: GET_SPOT_BY_CURRENT_USER,
        payload: spots,
    };
};

const DELETE_SPOT = "spot/deleteSpot";

const deleteSpot = (spot) => {
    return {
        type: DELETE_SPOT,
        payload: spot,
    };
};

const POST_SPOT_IMAGES = "spot/postImages";

const postSpotImages = (spotImages) => {
    return {
        type: POST_SPOT_IMAGES,
        payload: spotImages,
    };
};

// thunks

export const createSpotImages = (spotImages) => async (dispatch) => {
    const { spotId, url, preview } = spotImages;

    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, preview }),
    });

    if (response.ok) {
        const createdSpotImage = await response.json();

        dispatch(postSpotImages(createdSpotImage));

        return createdSpotImage;
    }
};

export const destroySpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteSpot(spotId));
    }
};

export const fetchAllSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");

    if (response.ok) {
        const data = await response.json();

        const spots = data.Spots;

        dispatch(getSpots(spots));

        return spots;
    }
};

export const fetchSpotById = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const data = await response.json();

        dispatch(getSpotById(data));

        return data;
    }
};

export const fetchSpotByCurrentUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current");

    if (response.ok) {
        const data = await response.json();

        dispatch(getSpotByCurrentUser(data));

        return data;
    }
};

export const editSpot = (spot, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spot),
    });

    if (response.ok) {
        const updatedSpot = await response.json();

        dispatch(updateSpot(updatedSpot));

        return updatedSpot;
    }
};

export const postSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spot),
    });

    if (response.ok) {
        const newSpot = await response.json();

        dispatch(createSpot(newSpot));

        return newSpot;
    }
};

const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = { ...state };
            action.payload.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case GET_SPOT_BY_ID: {
            return {
                ...state,
                [action.payload.id]: action.payload,
            };
        }
        case POST_SPOT: {
            return {
                ...state,
                [action.payload.id]: action.payload,
            };
        }
        case GET_SPOT_BY_CURRENT_USER: {
            const newState = {};
            action.payload.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case EDIT_SPOT: {
            const newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        case POST_SPOT_IMAGES: {
            return { ...state, [action.payload.id]: action.image };
        }
        default:
            return state;
    }
};

export default spotReducer;
