import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllSpots } from "../../store/spot";
import "./Spot.css";
import { NavLink} from "react-router-dom";
import { GiJusticeStar } from "react-icons/gi";

const Spots = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector((state) => state.spots);
    const spots = Object.values(spotsObj);

    useEffect(() => {
        dispatch(fetchAllSpots());
    }, [dispatch]);

    console.log('hello', spots[0].avgRating)
    return (
        <div>
            <ul id="spot-list">
                {spots.map((spot) =>
                    spot && spot.id ? (
                        <li id="spot-item" key={spot.id}>
                            <NavLink to={`/spots/${spot.id}`} className="tooltip">
                            <h1>
                            {spot.name}
                            </h1>
                            </NavLink>
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
                                        <h2>{spot && spot.avgRating}</h2>
                                        {/* <h2>
                                            {typeof spot.avgRating === "number"
                                                ? spot.avgRating?.toFixed(1)
                                                : "New Spot!"}
                                        </h2> */}
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
