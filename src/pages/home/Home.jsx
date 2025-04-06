import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGames, setCurrentPage } from "../../service/redux/gamesSlice";
import { GameCard } from "../../components/GameCard";
import { GameModal } from "../../components/GameModal";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import "./style.css";

export const Home = () => {
  const dispatch = useDispatch();
  const { items: games, status, currentPage, totalPages } = useSelector((state) => state.games);

  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchGames({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageRange = () => {
    const range = [];
    const maxVisible = isMobile ? 3 : 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="home-container">
      {isMobile && (
        <button className="mobile-menu-btn" onClick={() => setSidebarVisible(!sidebarVisible)}>
          {sidebarVisible ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <AnimatePresence>
        {sidebarVisible && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`sidebar-container ${isMobile ? "mobile-sidebar" : ""}`}
          >
            <Sidebar onClose={() => isMobile && setSidebarVisible(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="main-content">
        {status === "loading" ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="content-header"
            >
              <div>
                <h1 className="content-title">💀 Only Hunters Can Enter</h1>
                <p className="content-subtitle">The weak fear the filters. The strong use them.</p>
              </div>
            </motion.div>

            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="games-grid"
            >
              {games.map((game) => (
                <GameCard key={game.id} game={game} onSelect={setSelectedGame} />
              ))}
            </motion.div>

            <div className="pagination-container">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
                {!isMobile && "Previous"}
              </motion.button>

              {getPageRange().map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(page)}
                  className={`page-number ${currentPage === page ? "active" : ""}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
                aria-label="Next page"
              >
                {!isMobile && "Next"}
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </>
        )}
      </main>

      <AnimatePresence>
        {selectedGame && (
          <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
