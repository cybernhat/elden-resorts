import { csrfFetch } from './csrf';

const GET_REVIEWS = "reviews/getReviews";

const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        payload: reviews,
    };
};

const POST_REVIEW = 'review/postReview';

const createReview = (review) => {
    return {
        type: POST_REVIEW,
        payload: review
    }
}

const DELETE_REVIEW = 'review/deleteReview';

const deleteReview = (review) => {
    return {
        type: DELETE_REVIEW,
        payload: review
    }

}

const RESET_REVIEWS = "reviews/resetReviews";

const resetReviews = () => {
    return {
        type: RESET_REVIEWS
    };
};


export const destroyReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        dispatch(deleteReview(reviewId))
    }
}
export const postReview = (spotId, review) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });

        if (response.ok) {
            const newReview = await response.json();

            dispatch(createReview(newReview));

            return newReview
        }
}

export const fetchReviews = (spotId) => async (dispatch) => {
    dispatch(resetReviews());
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
            const newState = { ...state};
            action.payload.forEach((review) => {
                newState[review.id] = review;
            });
            return newState;
        }
        case POST_REVIEW: {
            return {...state,
                [action.payload.id]: action.payload
             }
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        case RESET_REVIEWS: {
            return {};
        }
        default:
            return state;
    }
};

export default reviewReducer;
