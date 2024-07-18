import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotByCurrentUser } from "../../store/spot";
import "./Spot.css";
import { NavLink } from "react-router-dom";
import { GiJusticeStar } from "react-icons/gi";

const ManageSpot = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpotByCurrentUser());
    }, [dispatch]);

    const spotsObj = useSelector((state) => state.spots);

    const spots = Object.values(spotsObj);

    return (
        <div>
            <h1>Manage Your Spots</h1>
            <ul id="spot-list">
                {spots.map((spot) =>
                    spot && spot.id ? (
                        <li id="spot-item" key={spot.id}>
                            <NavLink id="nav-link" to={`/spots/${spot.id}`}>
                                <img
                                    className="spot-image"
                                    src={spot.previewImage}
                                    alt={`${spot.name} preview`}
                                />
                                <div className="info">
                                    <h2>{`${spot.city}, ${spot.state}`}</h2>
                                    <div className="star-rating">
                                        <GiJusticeStar id="star-icon" />
                                        {spot.avgRating ? (
                                            <h2>{spot.avgRating}</h2>
                                        ) : (
                                            <h2>New Spot!</h2>
                                        )}
                                    </div>
                                </div>
                                <h3>ᚠ {spot.price} runes per night</h3>
                            </NavLink>
                            <div id="update-delete-container">
                                <button className="manage-button">
                                    <NavLink
                                    to={`/spots/${spot.id}/edit`}>
                                    Update
                                    </NavLink>
                                </button>
                                <button className="manage-button">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ) : null
                )}
            </ul>
        </div>
    );
};

export default ManageSpot;
