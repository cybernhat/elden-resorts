import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllSpots } from "../../store/spot";
import "./Spot.css";
import { NavLink } from "react-router-dom";
import { GiJusticeStar } from "react-icons/gi";

const Spots = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector((state) => state.spots);
    const spots = Object.values(spotsObj);

    useEffect(() => {
        dispatch(fetchAllSpots());
    }, [dispatch]);

    const getImageUrl = (previewImage) => {
        if (typeof previewImage === "string") {
            return previewImage;
        } else if (Array.isArray(previewImage) && previewImage.length > 0) {
            const previewImgObj = previewImage.find((img) => img.preview);
            return previewImgObj ? previewImgObj.url : "";
        }
        return "";
    };

    return (
        <div>
            <ul id="spot-list">
                {spots.map((spot) =>
                    spot && spot.id ? (
                        <li id="spot-item" key={spot.id}>
                            <NavLink
                                to={`/spots/${spot.id}`}
                                className="tooltip"
                            >
                                <h1>{spot.name}</h1>
                            </NavLink>
                            <NavLink id="nav-link" to={`/spots/${spot.id}`}>
                                {spot && spot.previewImage ? (
                                    <img
                                        className="spot-image"
                                        src={getImageUrl(spot.previewImage)}
                                        alt={`${spot.name} preview`}
                                    />
                                ) : spot && spot.previewImages ? (
                                    <img
                                        className="spot-image"
                                        src={getImageUrl(
                                            spot.previewImages[0].url
                                        )}
                                        alt={`${spot.name} preview`}
                                    />
                                ) : null}
                                <div className="info">
                                    <h2>{`${spot.city}, ${spot.state}`}</h2>
                                    <div className="star-rating">
                                        <GiJusticeStar id="star-icon" />
                                        {spot && spot.avgRating != null ? (
                                            <h2>
                                                {parseFloat(
                                                    spot.avgRating
                                                ).toFixed(1)}
                                            </h2>
                                        ) : (
                                            <h2>New Spot!</h2>
                                        )}
                                    </div>
                                </div>
                                <h3>ᚠ {spot.price} runes per night</h3>
                            </NavLink>
                        </li>
                    ) : null
                )}
            </ul>
        </div>
    );
};

export default Spots;
