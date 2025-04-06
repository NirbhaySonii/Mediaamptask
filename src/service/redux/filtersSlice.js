import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    genres: [],
    platforms: [],
    ordering: "",
  },
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearFilters: (state) => {
      state.genres = [];
      state.platforms = [];
      state.ordering = "";
    },
    togglePlatform: (state, action) => {
      const platform = action.payload;
      if (state.platforms.includes(platform)) {
        state.platforms = state.platforms.filter((p) => p !== platform);
      } else {
        state.platforms.push(platform);
      }
    },
  },
});

export const { setFilters, clearFilters, togglePlatform } = filtersSlice.actions;
export default filtersSlice.reducer;
