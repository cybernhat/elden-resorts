import './DeleteReviewModal.css';
import { useModal } from "../../context/Modal";
import { destroyReview } from '../../store/review';
import { useDispatch } from 'react-redux';

const DeleteReviewModal = ({ reviewId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteReview = e => {
        e.preventDefault();
        dispatch(destroyReview(reviewId));

        closeModal();
    }

    const handleKeepReview = e => {
        e.preventDefault();
    }

    return (
    <div className='delete-modal'>
        <h2>Confirm Delete</h2>
        <h3>Are you sure you want to delete this review?</h3>
        <div id='delete-button-container'>
            <button className='delete-button' onClick={handleDeleteReview}>
                Yes (Delete Review)
            </button>
            <button className='keep-button' onClick={handleKeepReview}>
                No (Keep Review)
            </button>
        </div>
    </div>
    )
}

export default DeleteReviewModal;
