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
        dispatch(fetchSpotById(spotId))
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId]);

    const formatDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(part => part.padStart(2, '0'));
        const [hour, minute, second] = timePart.split(':').map(part => part.padStart(2, '0'));

        const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate} @ ${formattedTime}`;
    };

    const spot = useSelector((state) => state.spots[spotId]);
    const reviews = useSelector((state) => state.reviews);

    if (!spot) return <h1>Loading...</h1>;

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
                    ) : null}
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
                                <GiJusticeStar className="star-icon" />
                                <h3>{spot.avgRating}</h3>
                            </div>
                            <h3 className="reviews">{`${spot.numReviews} reviews`}</h3>
                        </div>
                        <button className="reserve-button">Reserve</button>
                    </div>
                </div>
                <div>
                    <h1>{reviews.id}</h1>
                </div>
            </div>
            <div id='reviews-card'>
                <div id="review-heading">
                    <div id="rating-container">
                        <GiJusticeStar className="star-icon" />
                        <h3>{spot.avgRating}</h3>
                    </div>
                    <h3 className="reviews">{`${spot.numReviews} reviews`}</h3>
                </div>
                {reviews.reviews && reviews.reviews.length > 0 ? (
                    reviews.reviews.map(review => (
                        <div key={review.id} className='reviewCard'>
                            <h3>{review.User.firstName}</h3>
                            <span>{formatDate(review.createdAt)}</span>
                            <h4>{review.review}</h4>
                        </div>
                    ))
                ) : (
                    <p>No reviews available.</p>
                )}
            </div>
        </div>
    );
};

export default SpotById;
