import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotById } from "../../store/spot";
import "./SpotById.css";
import { GiJusticeStar } from "react-icons/gi";
import { fetchReviews } from "../../store/review";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ReserveModal from "./ReserveModal";
import ReviewModal from "../Reviews/ReviewModal";
import DeleteReviewModal from "../Reviews/DeleteReviewModal";

const SpotById = () => {
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spots[spotId]);
    const reviewsObject = useSelector((state) => state.reviews);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpotById(spotId));
        dispatch(fetchReviews(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        dispatch(fetchSpotById(spotId));
    }, [reviewsObject, spotId, dispatch]);

    const reviews = Object.values(reviewsObject);

    const userHasReviewed =
        reviewsObject && user
            ? reviews.find((review) => review.userId === user.id)
            : false;

    const formatDate = (dateString) => {
        const [datePart, timePart] = dateString.split(" ");
        const [year, month, day] = datePart
            .split("-")
            .map((part) => part.padStart(2, "0"));
        const [hour, minute, second] = timePart
            .split(":")
            .map((part) => part.padStart(2, "0"));

        const date = new Date(
            `${year}-${month}-${day}T${hour}:${minute}:${second}`
        );
        const options = { year: "numeric", month: "long", day: "numeric" };
        const timeOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };

        const formattedDate = date.toLocaleDateString("en-US", options);
        const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

        return `${formattedDate} @ ${formattedTime}`;
    };

    if (!spot) return <h1>Loading...</h1>;

    return (
        <div id="container">
            <div id="spot-card">
                <h1 id='spot-name'>{spot.name}</h1>
                <h2>
                    {spot.city}, {spot.state}, {spot.country}
                </h2>
                <div id="images">
                    {spot.previewImages && spot.previewImages[0] ? (
                        <img
                            key={spot.previewImages[0].id}
                            src={spot.previewImages[0].url}
                            className="main-image"
                        />
                    ) : null}
                    <div className="sub-images-container">
                        {spot.previewImages &&
                            spot.previewImages
                                .slice(1, 5)
                                .map((image, index) =>
                                    image.url ? (
                                        <img
                                            key={index}
                                            src={image.url}
                                            className="sub-images"
                                            alt={`Spot sub-image ${index + 1}`}
                                        />
                                    ) : null
                                )}
                    </div>
                </div>
                <div id="description-reserve-container">
                    <div id="description-container">
                        <h1>
                            {spot.Owner
                                ? `Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`
                                : "Host information not available"}
                        </h1>
                        <h4>{spot.description}</h4>
                    </div>
                    <div id="reserve-container">
                        <div id="price-review-container">
                            <h3 className="price-night">
                                ᚠ {spot.price} per night
                            </h3>
                            <div id="rating-container">
                                {typeof spot.avgRating === "number" ? (
                                    <div className="reserve-star">
                                        <GiJusticeStar className="spot-star-icon" />
                                        <h3>{spot.avgRating.toFixed(1)}</h3>
                                    </div>
                                ) : (
                                    <h3>New Spot!</h3>
                                )}
                            </div>
                            {spot.numReviews === "no reviews yet" ? null : (
                                <div className="review-dot">
                                    <h3 className="reviews">{`• ${spot.numReviews} reviews`}</h3>
                                </div>
                            )}
                        </div>
                        <button className="reserve-button">
                            <OpenModalMenuItem
                                itemText="Reserve"
                                modalComponent={<ReserveModal />}
                            />
                        </button>
                    </div>
                </div>
                <div>
                    <h1>{reviews.id}</h1>
                </div>
            </div>
            <div id="reviews-card">
                <div id="review-heading">
                    <div id="review-rating-container">
                        {typeof spot.avgRating === "number" ? (
                            <div id="review-star-container">
                                <GiJusticeStar className="star-icon" />
                                <h3>{spot.avgRating.toFixed(1)}</h3>
                            </div>
                        ) : (
                            <h3>New Spot!</h3>
                        )}
                    </div>
                    {spot.numReviews === 0 ? (
                        <h3 className="reviews">No reviews yet</h3>
                    ) : spot.numReviews === 1 ? (
                        <h3 className="reviews">{`• ${spot.numReviews} review`}</h3>
                    ) : spot.numReviews > 1 ? (
                        <h3 className="reviews">{`• ${spot.numReviews} reviews`}</h3>
                    ) : null}
                    {spot &&
                    user &&
                    user.id !== spot.ownerId &&
                    !userHasReviewed ? (
                        <button className="add-review-button">
                            <OpenModalMenuItem
                                itemText="Add Review"
                                modalComponent={<ReviewModal spotId={spotId} />}
                            />
                        </button>
                    ) : null}
                </div>
                <div id="comment-card">
                    {Object.values(reviews).length > 0 ? (
                        reviews
                            .slice()
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                            )
                            .map((review) => (
                                <div key={review.id} id="review-card">
                                    <h3>
                                        {review.User?.firstName || "Anonymous"}
                                    </h3>
                                    <span>{formatDate(review.createdAt)}</span>
                                    <h4>{review.review}</h4>
                                    {user && user.id === review.userId ? (
                                        <button id="delete-review-button">
                                            <OpenModalMenuItem
                                                itemText="Delete"
                                                modalComponent={ 
                                                    <DeleteReviewModal
                                                        reviewId={review.id}
                                                    />
                                                }
                                            />
                                        </button>
                                    ) : null}
                                </div>
                            ))
                    ) : (
                        <p>
                            {spot && user && user.id !== spot.ownerId
                                ? "Be the first to post a review!"
                                : "No reviews available."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotById;
