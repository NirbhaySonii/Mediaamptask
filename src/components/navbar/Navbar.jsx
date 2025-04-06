import {
  Search,
  LogOut,
  Heart,
  Home,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchGames } from "../../service/redux/gamesSlice";
import { clearFavorites } from "../../service/redux/favoritesSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

import logo from "../../assets/logo.png"; 
import "./style.css";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        dispatch(fetchGames({ search: value }));
      }
    }, 2000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchGames({ search: searchQuery }));
    }
  };

  const handleLogout = async () => {
    await signOut();
    dispatch(clearFavorites());
    navigate("/");
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* 🔵 LOGO + TITLE LEFT */}
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">
            <img src={logo} alt="GameBuddy Logo" className="logo-image" />
            <span className="logo-text">GameBuddy</span>
          </Link>
        </div>

        {/* 🔍 SEARCH BAR */}
        <form onSubmit={handleSearch} className={`search-form ${isMobileMenuOpen ? "show-mobile" : ""}`}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search className="search-icon" />
            </button>
          </div>
        </form>

        {/* 🙋‍♂️ ACTION BUTTONS */}
        <div className={`navbar-actions ${isMobileMenuOpen ? "show-mobile" : ""}`}>
          {isSignedIn ? (
            <div className="navbar-user" ref={dropdownRef}>
              <Link to="/home" className={`nav-btn ${isActive("/home") ? "active" : ""}`}>
                <Home size={16} />
                <span className="nav-text">Home</span>
              </Link>

              <Link to="/library" className={`nav-btn ${isActive("/library") ? "active" : ""}`}>
                <Heart size={16} />
                <span className="nav-text">Favorites</span>
              </Link>

              <button onClick={handleLogout} className="nav-btn">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/sign-in" className="nav-btn">Log In</Link>
              <Link to="/sign-up" className="nav-btn nav-btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
