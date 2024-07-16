import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='nav'>
      <li>
        <NavLink to="/">
        <img id='home-icon' src='/resizedhomepage.png' alt='Home'/>
        </NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton id='profile-button' user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
