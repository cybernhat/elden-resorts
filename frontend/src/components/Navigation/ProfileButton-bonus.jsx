import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { PiUserListBold } from "react-icons/pi";
import "./ProfileButton.css";

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate();
    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        navigate("/");
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <div id="user-container">
                {user && (
                    <NavLink id="spot-creator" to="/spots/create">
                        Create a Spot
                    </NavLink>
                )}
                <button id="user-button" onClick={toggleMenu}>
                    <PiUserListBold className="user-icon" />
                </button>
            </div>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <div id="logged-in-dropdown">
                        <li>Hello, {user.firstName}!</li>
                        <li>{user.email}</li>
                        <li>
                            <button>
                                <Link to="/spots/manage">Manage Spots</Link>
                            </button>
                        </li>
                        <li>
                            <button onClick={logout}>
                                <Link to="/">Log Out</Link>
                            </button>
                        </li>
                    </div>
                ) : (
                    <>
                        <button>
                            <OpenModalMenuItem
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </button>
                        <button>
                            <OpenModalMenuItem
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                        </button>
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
