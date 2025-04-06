import { useSelector } from "react-redux";
import { GameCard } from "../../components/GameCard";
import { GameModal } from "../../components/GameModal";
import { useState } from "react";
import "./style.css";

export const Books = () => {
  const favorites = useSelector((state) => state.favorites.items);
  const [selectedGame, setSelectedGame] = useState(null);

  if (favorites.length === 0) {
    return (
      <div className="books-container">
        <div className="library-empty">
          <h2>Your Library is Empty</h2>
          <p>
            Start adding games to your library by clicking the heart icon on
            games you like!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="books-container">
      <h1 className="library-title">My Library</h1>
      <div className="library-grid">
        {favorites.map((game) => (
          <GameCard key={game.id} game={game} onSelect={setSelectedGame} />
        ))}
      </div>

      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
};

export default Books;
