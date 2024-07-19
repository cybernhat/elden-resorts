import "./DeleteSpotModal.css";
import { destroySpot } from "../../store/spot";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

const DeleteModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();

        dispatch(destroySpot(spotId));

        closeModal();
    };

    const handleKeep = (e) => {
        e.preventDefault();

        closeModal();
    }

    return (
        <div className="delete-modal">
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this spot?</h3>
            <div id="delete-button-container">
                <button className="delete-button" onClick={handleDelete}>
                    Yes (Delete Spot)
                </button>
                <button className="keep-button" onClick={handleKeep}>No (Keep Spot)</button>
            </div>
        </div>
    );
};

export default DeleteModal;
