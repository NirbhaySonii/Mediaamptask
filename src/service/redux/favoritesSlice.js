import { createSlice } from "@reduxjs/toolkit";

const loadFavorites = () => {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
};

const saveFavorites = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: loadFavorites(),
  },
  reducers: {
    addFavorite: (state, action) => {
      state.items.push(action.payload);
      saveFavorites(state.items);
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((game) => game.id !== action.payload);
      saveFavorites(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem("favorites");
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
