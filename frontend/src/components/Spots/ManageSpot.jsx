import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotByCurrentUser } from "../../store/spot";
import { NavLink } from "react-router-dom";
import { GiJusticeStar } from "react-icons/gi";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpotModal from "./DeleteSpotModal";
import "./ManageSpot.css";

const ManageSpot = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpotByCurrentUser());
    }, [dispatch]);

    const spotsObj = useSelector((state) => state.spots);
    const user = useSelector((state) => state.session.user);

    const getImageUrl = (previewImage) => {
        if (typeof previewImage === "string") {
            return previewImage;
        } else if (Array.isArray(previewImage) && previewImage.length > 0) {
            const previewImgObj = previewImage.find((img) => img.preview);
            return previewImgObj ? previewImgObj.url : "";
        }
        return "";
    };

    const spots = Object.values(spotsObj);

    if (spots) {
        console.log('000000', spots[0])
    }
    return (
        <div id="manage-spot-container">
            <h1>Manage Your Spots</h1>
            <button id="button-container">
                <NavLink to="/spots/create">Create a Spot</NavLink>
            </button>
            {spots && spots.length ? (
                <ul id="spot-list">
                    {spots.map((spot) =>
                        spot && spot.id ? (
                            <li id="spot-item" key={spot.id}>
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
                                            {typeof spot.avgRating === 'number'? (
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
                                        <NavLink to={`/spots/${spot.id}/edit`}>
                                            Update
                                        </NavLink>
                                    </button>
                                    <button className="manage-button">
                                        <OpenModalMenuItem
                                            itemText="Delete"
                                            modalComponent={
                                                <DeleteSpotModal
                                                    spotId={spot.id}
                                                />
                                            }
                                        />
                                    </button>
                                </div>
                            </li>
                        ) : null
                    )}
                </ul>
            ) : (
                <div id="no-spot-container">
                    <h2>No spots yet</h2>
                </div>
            )}
        </div>
    );
};

export default ManageSpot;
