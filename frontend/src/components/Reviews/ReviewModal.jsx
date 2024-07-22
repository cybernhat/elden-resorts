import { useEffect, useState } from "react";
import "./ReviewModal.css";
import { GiJusticeStar } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { postReview } from "../../store/review";
import { useModal } from '../../context/Modal';
import { fetchReviews } from "../../store/review";

const ReviewModal = ( {spotId} ) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        let reviewErrors = {};

        if (review.length < 10) reviewErrors.review = "Review is too short";
        if (rating <= 0) reviewErrors.rating = "Need to select a rating";

        setErrors(reviewErrors);
    }, [review, rating]);

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (!spotId) {
            console.error('spotId is undefined');
            return;
        }

        const reviewBody = {
            userId: user.id,
            spotId: spotId,
            review: review,
            stars: rating,
        };

        const newReview = await dispatch(postReview(spotId, reviewBody));
        if (newReview) {
            dispatch(fetchReviews(spotId)); // Refresh reviews
            closeModal();
        }
    };

    return (
        <div id="review-form-container">
            <h1>How was your stay?</h1>
            <textarea
                className="review-text-area"
                placeholder="Leave your review here"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            ></textarea>
            {hasSubmitted && errors.rating && <span>{errors.review}</span>}
            <div className="star-rating-container">
                {[...Array(5)].map((_, index) => (
                    <GiJusticeStar
                        id="star-icon"
                        key={index}
                        className={`star ${index < rating ? "selected" : ""}`}
                        onClick={() => handleStarClick(index)}
                    />
                ))}
                <h2>Stars</h2>
            </div>
            {hasSubmitted && errors.rating && <span>{errors.rating}</span>}
            <button
                onClick={handleSubmit}
                disabled={Object.keys(errors).length > 0}
            >
                Submit Review
            </button>
        </div>
    );
};

export default ReviewModal;
