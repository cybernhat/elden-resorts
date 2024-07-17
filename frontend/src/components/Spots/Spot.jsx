import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllSpots } from '../../store/spot';
import './Spot.css';
import { NavLink } from 'react-router-dom'
import { GiJusticeStar } from "react-icons/gi";

const Spots = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots);
    const spots = Object.values(spotsObj);

    useEffect(() => {
        dispatch(fetchAllSpots())
    }, [dispatch])

    console.log('spots', spots)
    return (
        <div>
          <ul id='spot-list'>
            {spots.map(spot => (
              <li id='spot-item' key={spot.id}>
                <NavLink id='nav-link'to={`spots/${spot.id}`}>
                    <img className='spot-image' src={spot.previewImage}/>
                    <div className='info'>
                      <h2>{`${spot.city}, ${spot.state}`}</h2>
                      <div className='star-rating'>
                      <GiJusticeStar className='star-icon'/>
                        <h2>{spot.avgRating}</h2>
                      </div>
                    </div>
                     <h3>ᚠ {spot.price} runes per night</h3>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      );
};

export default Spots;
