const GET_REVIEWS = "reviews/getReviews";

const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        payload: reviews,
    };
};

export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {

        const data = await response.json();

        dispatch(getReviews(data));

        return data;
    }
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS: {
            const newState = {
                ...state,
                reviews: action.payload };
            return newState;
        }
        default:
            return state;
    }
};

export default reviewReducer;
