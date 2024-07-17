import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotById } from '../../store/spot';
import './Spot.css';
import './SpotById.css';

const SpotById = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    useEffect(() => {
        dispatch(fetchSpotById(spotId))
    }, [dispatch, spotId]);

    const spot = useSelector(state => state.spots[spotId]);

    if (!spot) return <h1>Loading...</h1>

    return (
        <div id='spot-card'>
            <h1>{spot.name}</h1>
            <h2>{spot.city}, {spot.state}, {spot.country}</h2>
            <div id='images'>
                {spot.previewImages && spot.previewImages[0]? (
                    <img
                    key={spot.previewImages[0].id}
                    src={spot.previewImages[0].url}
                    className='main-image'/>
                ) : (
                    null
                )}
                <div className='sub-images-container'>
                    {spot.previewImages && spot.previewImages[1]? (
                        <img
                        key={spot.previewImages[1].id}
                        src={spot.previewImages[1].url}
                        className='sub-images'
                        />
                    ) : (
                        <img className='sub-images-placeholder' src='https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*'/>
                    )}
                    {spot.previewImages && spot.previewImages[2]? (
                        <img
                        key={spot.previewImages[2].id}
                        src={spot.previewImages[2].url}
                        className='sub-images'
                        />
                    ) : (
                        <img className='sub-images-placeholder' src='https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*'/>
                    )}
                    {spot.previewImages && spot.previewImages[3]? (
                        <img
                        key={spot.previewImages[3].id}
                        src={spot.previewImages[3].url}
                        className='sub-images'
                        />
                    ) : (
                        <img className='sub-images-placeholder' src='https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*'/>
                    )}
                    {spot.previewImages && spot.previewImages[4]? (
                        <img
                        key={spot.previewImages[4].id}
                        src={spot.previewImages[4].url}
                        className='sub-images'
                        />
                    ) : (
                        <img className='sub-images-placeholder' src='https://hips.hearstapps.com/hmg-prod/images/bojnice-castle-1603142898.jpg?crop=0.668xw:1.00xh;0.116xw,0&resize=980:*'/>
                    )}
                </div>
            </div>
            <h1>{spot.Owner? `Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}` : 'Host information not available'}</h1>
            <span>{spot.description}</span>
        </div>
    )
}










export default SpotById
