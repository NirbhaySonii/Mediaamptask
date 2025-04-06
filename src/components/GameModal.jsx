import { X } from "lucide-react";
import "./GameModal.css";

export const GameModal = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <button onClick={onClose} className="modal-close-btn">
            <X className="modal-close-icon" />
          </button>
          <img
            src={game.background_image}
            alt={game.name}
            className="modal-header-img"
          />
        </div>

        <div className="modal-content">
          <h2 className="modal-title">{game.name}</h2>

          <div className="modal-grid">
            <div className="modal-info-section">
              <h3 className="modal-section-title">Rating</h3>
              <p className="modal-info-text">
                ★ {game.rating} ({game.ratings_count} reviews)
              </p>
            </div>
            <div className="modal-info-section">
              <h3 className="modal-section-title">Released</h3>
              <p className="modal-info-text">{game.released}</p>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Platforms</h3>
            <div className="modal-tag-container">
              {game.platforms?.map(({ platform }) => (
                <span key={platform.id} className="modal-tag">
                  {platform.name}
                </span>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Genres</h3>
            <div className="modal-tag-container">
              {game.genres?.map((genre) => (
                <span key={genre.id} className="modal-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Description</h3>
            <p className="modal-description">{game.description_raw}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
