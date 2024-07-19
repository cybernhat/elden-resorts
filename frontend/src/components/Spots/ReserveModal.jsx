import { useModal } from '../../context/Modal';
import './ReserveModal.css'
const ReserveModal = () => {
    const { closeModal } = useModal();

    return (
        <div className='reserve-modal'>
            <div className='modal-content'>
                <h2>Feature Coming Soon</h2>
                <button onClick={closeModal}>Close</button>
            </div>
        </div>
    )
}

export default ReserveModal;
