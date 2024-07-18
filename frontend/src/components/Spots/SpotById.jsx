import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotById } from "../../store/spot";
import "./SpotById.css";
import { GiJusticeStar } from "react-icons/gi";
import { fetchReviews } from "../../store/review";

const SpotById = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    useEffect(() => {
        dispatch(fetchSpotById(spotId));
        dispatch(fetchReviews(spotId));
    }, [dispatch, spotId]);

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

    const spot = useSelector((state) => state.spots[spotId]);
    const reviews = useSelector((state) => state.reviews);
    const user = useSelector((state) => state.session.user);

    if (!spot) return <h1>Loading...</h1>;

    console.log("spot", spot);
    return (
        <div>
            <div id="spot-card">
                <h1>{spot.name}</h1>
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
                    ) : (
                        <img
                            className="main-images-placeholder"
                            src="https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*"
                        />
                    )}
                    <div className="sub-images-container">
                        {spot.previewImages && spot.previewImages[1] ? (
                            <img
                                key={spot.previewImages[1].id}
                                src={spot.previewImages[1].url}
                                className="sub-images"
                            />
                        ) : (
                            <img
                                className="sub-images-placeholder"
                                src="https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*"
                            />
                        )}
                        {spot.previewImages && spot.previewImages[2] ? (
                            <img
                                key={spot.previewImages[2].id}
                                src={spot.previewImages[2].url}
                                className="sub-images"
                            />
                        ) : (
                            <img
                                className="sub-images-placeholder"
                                src="https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*"
                            />
                        )}
                        {spot.previewImages && spot.previewImages[3] ? (
                            <img
                                key={spot.previewImages[3].id}
                                src={spot.previewImages[3].url}
                                className="sub-images"
                            />
                        ) : (
                            <img
                                className="sub-images-placeholder"
                                src="https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*"
                            />
                        )}
                        {spot.previewImages && spot.previewImages[4] ? (
                            <img
                                key={spot.previewImages[4].id}
                                src={spot.previewImages[4].url}
                                className="sub-images"
                            />
                        ) : (
                            <img
                                className="sub-images-placeholder"
                                src="https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*"
                            />
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
                        <span>{spot.description}</span>
                    </div>
                    <div id="reserve-container">
                        <div id="price-review-container">
                            <h3>{spot.price} per night</h3>
                            <div id="rating-container">
                                {spot.avgRating === "no ratings yet" ? (
                                    <h3>New Spot!</h3>
                                ) : (
                                    <h3>{spot.avgRating}</h3>
                                )}
                            </div>
                            {spot.numReviews === "no reviews yet" ? null : (
                                <div className="review-dot">
                                    <h3>•</h3>
                                    <h3 className="reviews">{`${spot.numReviews} reviews`}</h3>
                                </div>
                            )}
                        </div>
                        <button className="reserve-button">Reserve</button>
                    </div>
                </div>
                <div>
                    <h1>{reviews.id}</h1>
                </div>
            </div>
            <div id="reviews-card">
                <div id="review-heading">
                    <div id="rating-container">
                        <GiJusticeStar className="star-icon" />
                        {spot.avgRating === "no ratings yet" ? (
                            <h3>New Spot!</h3>
                        ) : (
                            <h3>{spot.avgRating}</h3>
                        )}
                    </div>
                    {spot.numReviews === 0 ? (
                        <h3 className="reviews">No reviews yet</h3>
                    ) : spot.numReviews === 1 ? (
                        <h3 className="reviews">{`${spot.numReviews} review`}</h3>
                    ) : (
                        <h3 className="reviews">{`${spot.numReviews} reviews`}</h3>
                    )}
                    {spot && user && user.id !== spot.ownerId ? (
                        <button>Add Review</button>
                    ) : null}
                </div>
                {reviews.reviews && reviews.reviews.length > 0 ? (
                    reviews.reviews
                        .slice()
                        .sort(
                            (a, b) =>
                                new Date(a.createdAt) - new Date(b.createdAt)
                        )
                        .map((review) => (
                            <div key={review.id} className="reviewCard">
                                <h3>{review.User.firstName}</h3>
                                <span>{formatDate(review.createdAt)}</span>
                                <h4>{review.review}</h4>
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
    );
};

export default SpotById;
