import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllSpots } from '../../store/spot';
import './Spot.css';
import { NavLink } from 'react-router-dom'
const Spots = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots);
    const spots = Object.values(spotsObj);

    spots.forEach(spot => console.log(spot.previewImage))
    useEffect(() => {
        dispatch(fetchAllSpots())
    }, [dispatch])

    return (
        <div>
          <h1>Available Resorts</h1>
          <ul id='spot-list'>
            {spots.map(spot => (
              <li id='spot-item' key={spot.id}>
                <NavLink to='/' class='navlink'>
                    <img class='spot-image' src={spot.previewImage}/>
                    <h2>{`${spot.city}, ${spot.state}`}</h2>
                     <p>ᚠ {spot.price} runes</p>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      );
};

export default Spots;
