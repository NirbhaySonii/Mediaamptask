import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../service/redux/favoritesSlice";
import { useUser } from "@clerk/clerk-react";
import "./GameCard.css";

export const GameCard = ({ game, onSelect }) => {
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((fav) => fav.id === game.id);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!isSignedIn) return;

    if (isFavorite) {
      dispatch(removeFavorite(game.id));
    } else {
      dispatch(addFavorite(game));
    }
  };

  return (
    <div className="game-card" onClick={() => onSelect(game)}>
      <div className="game-card-image-container">
        <img
          src={game.background_image}
          alt={game.name}
          className="game-card-img"
        />
        <div className="game-card-overlay">
          <button
            onClick={toggleFavorite}
            className={`favorite-btn ${
              !isSignedIn ? "favorite-btn-disabled" : ""
            }`}
            disabled={!isSignedIn}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={
                isFavorite ? "favorite-icon favorite-active" : "favorite-icon"
              }
            />
          </button>
        </div>
        {game.genres && game.genres.length > 0 && (
          <div className="game-card-genre">{game.genres[0].name}</div>
        )}
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <div className="game-card-footer">
          <div className="game-card-meta">
            <span className="game-card-rating">★ {game.rating.toFixed(1)}</span>
            {game.released && (
              <span className="game-card-release">
                {new Date(game.released).getFullYear()}
              </span>
            )}
          </div>
          <div className="game-card-platforms">
            {game.platforms &&
              game.platforms.slice(0, 3).map(({ platform }) => (
                <span
                  key={platform.id}
                  className="game-card-platform"
                  title={platform.name}
                >
                  {getPlatformIcon(platform.name)}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};


function getPlatformIcon(platformName) {
  const name = platformName.toLowerCase();
  if (name.includes("playstation")) return "PS";
  if (name.includes("xbox")) return "XB";
  if (name.includes("pc")) return "PC";
  if (name.includes("nintendo") || name.includes("switch")) return "SW";
  if (name.includes("ios") || name.includes("apple")) return "iOS";
  if (name.includes("android")) return "AD";
  return "•";
}
