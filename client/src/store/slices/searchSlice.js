import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchUnits } from '../../utils/api';

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (query, { rejectWithValue, getState }) => {
    try {
      // Get units from the Redux store instead of fetching from API
      const state = getState();
      const allUnits = state.units.items;
      
      // Filter units based on the query, performing a case-insensitive search
      const searchTerm = query.toLowerCase();
      const results = allUnits.filter(unit =>
        unit.name_of_unit?.toLowerCase().includes(searchTerm) ||
        unit.brigade_or_higher?.toLowerCase().includes(searchTerm) ||
        unit.mil_unit?.toLowerCase().includes(searchTerm) ||
        unit.description?.toLowerCase().includes(searchTerm) ||
        unit.email?.toLowerCase().includes(searchTerm) ||
        unit.computer_name?.toLowerCase().includes(searchTerm) ||
        unit.ip_address?.toLowerCase().includes(searchTerm) ||
        unit.status?.toLowerCase().includes(searchTerm)
      );
      
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    filteredResults: [],
    loading: false,
    error: null,
    showResults: false
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
      
      // If query is empty, clear results
      if (!action.payload.trim()) {
        state.showResults = false;
      }
      
      // Filter existing results based on the new query if we already have results
      if (state.results.length > 0) {
        const searchTerm = action.payload.toLowerCase();
        state.filteredResults = state.results.filter(unit =>
          unit.name_of_unit?.toLowerCase().includes(searchTerm) ||
          unit.brigade_or_higher?.toLowerCase().includes(searchTerm) ||
          unit.mil_unit?.toLowerCase().includes(searchTerm) ||
          unit.description?.toLowerCase().includes(searchTerm) ||
          unit.email?.toLowerCase().includes(searchTerm) ||
          unit.computer_name?.toLowerCase().includes(searchTerm) ||
          unit.ip_address?.toLowerCase().includes(searchTerm) ||
          unit.status?.toLowerCase().includes(searchTerm)
        );
      }
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.filteredResults = [];
      state.showResults = false;
    },
    hideResults: (state) => {
      state.showResults = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload || [];
        state.filteredResults = action.payload || [];
        state.showResults = true;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setQuery, clearSearch, hideResults } = searchSlice.actions;

export default searchSlice.reducer;
