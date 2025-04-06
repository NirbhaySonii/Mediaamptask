import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_RAWG;
const BASE_URL = "https://api.rawg.io/api";

export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async ({ page = 1, search = "", filters = {} }, { rejectWithValue }) => {
    try {
      const params = {
        key: API_KEY,
        page,
        page_size: 20, 
        search,
        ...filters,
        platforms: filters.platforms?.join(","), 
      };

      
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === "") {
          delete params[key];
        }
      });

      const response = await axios.get(`${BASE_URL}/games`, { params });
      return {
        data: response.data,
        page,
        filters 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle", 
  error: null,
  currentPage: 1,
  totalPages: 0,
  currentFilters: {
    platforms: null,
    genres: null,
    ordering: "-rating",
    
  },
  platformOptions: [
    { id: 4, name: "PC" },
    { id: 18, name: "PlayStation" },
    { id: 7, name: "Nintendo" },
    { id: 1, name: "Xbox" },
    { id: 21, name: "Android" },
    { id: 3, name: "iOS" }
  ]
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPlatformFilter: (state, action) => {
      state.currentFilters.platforms = action.payload;
      state.currentPage = 1; 
    },
    setGenreFilter: (state, action) => {
      state.currentFilters.genres = action.payload;
      state.currentPage = 1;
    },
    setSorting: (state, action) => {
      state.currentFilters.ordering = action.payload;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.currentFilters = initialState.currentFilters;
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data.results;
        state.totalPages = Math.ceil(action.payload.data.count / 20);
        state.currentPage = action.payload.page;
        state.currentFilters = {
          ...state.currentFilters,
          ...action.payload.filters
        };
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch games";
      });
  }
});

export const { 
  setCurrentPage, 
  setPlatformFilter,
  setGenreFilter,
  setSorting,
  resetFilters
} = gamesSlice.actions;

// Selectors
export const selectAllGames = (state) => state.games.items;
export const selectCurrentFilters = (state) => state.games.currentFilters;
export const selectPlatformOptions = (state) => state.games.platformOptions;
export const selectGamesStatus = (state) => state.games.status;
export const selectGamesError = (state) => state.games.error;
export const selectPagination = (state) => ({
  currentPage: state.games.currentPage,
  totalPages: state.games.totalPages
});

export default gamesSlice.reducer;