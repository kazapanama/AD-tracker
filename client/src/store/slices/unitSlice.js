import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUnits, getUnitById, createUnit, updateUnit, deleteUnit } from '../../utils/api';

export const fetchUnits = createAsyncThunk(
  'units/fetchUnits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnits();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnitById = createAsyncThunk(
  'units/fetchUnitById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUnitById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUnit = createAsyncThunk(
  'units/addUnit',
  async (unitData, { rejectWithValue }) => {
    try {
      const response = await createUnit(unitData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editUnit = createAsyncThunk(
  'units/editUnit',
  async ({ id, unitData }, { rejectWithValue }) => {
    try {
      const response = await updateUnit(id, unitData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeUnit = createAsyncThunk(
  'units/removeUnit',
  async (id, { rejectWithValue }) => {
    try {
      await deleteUnit(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const unitSlice = createSlice({
  name: 'units',
  initialState: {
    items: [],
    filteredItems: [],
    currentUnit: null,
    loading: false,
    error: null,
    sortField: null,
    sortDirection: 'asc',
    filters: {},
    displayCount: 0
  },
  reducers: {
    sortUnits: (state, action) => {
      const field = action.payload;
      
      // If clicking the same field, toggle direction
      if (field === state.sortField) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
        state.sortDirection = 'asc';
      }
      
      const sorted = [...state.filteredItems].sort((a, b) => {
        // Handle null or undefined values
        if (a[field] === null || a[field] === undefined) return 1;
        if (b[field] === null || b[field] === undefined) return -1;
        
        // Compare based on value type
        if (typeof a[field] === 'string') {
          const comparison = a[field].localeCompare(b[field]);
          return state.sortDirection === 'asc' ? comparison : -comparison;
        } else {
          const comparison = a[field] - b[field];
          return state.sortDirection === 'asc' ? comparison : -comparison;
        }
      });
      
      state.filteredItems = sorted;
    },
    setFilter: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
      
      // Apply all current filters
      state.filteredItems = state.items.filter(item => {
        // Check each filter
        for (const [filterField, filterValue] of Object.entries(state.filters)) {
          if (filterValue === '') continue; // Skip empty filters
          
          // Date range filtering
          if (filterField === 'date_from' && filterValue) {
            const itemDate = new Date(item.date_when_finished || null);
            const fromDate = new Date(filterValue);
            
            // Invalid dates should be excluded
            if (isNaN(itemDate.getTime()) || itemDate < fromDate) {
              return false;
            }
            continue;
          }
          
          if (filterField === 'date_to' && filterValue) {
            const itemDate = new Date(item.date_when_finished || null);
            const toDate = new Date(filterValue);
            toDate.setHours(23, 59, 59, 999); // Set to end of day
            
            // Invalid dates should be excluded
            if (isNaN(itemDate.getTime()) || itemDate > toDate) {
              return false;
            }
            continue;
          }
          
          // Skip items that don't match the filter
          const itemValue = item[filterField];
          if (typeof itemValue === 'string') {
            if (!itemValue.toLowerCase().includes(filterValue.toLowerCase())) {
              return false;
            }
          } else if (filterField === 'sended_to_legend') {
            // Special handling for sended_to_legend numeric field
            if (Number(itemValue) !== Number(filterValue)) {
              return false;
            }
          } else if (itemValue !== undefined && filterValue !== '') {
            // For boolean or exact match filters
            if (itemValue !== filterValue) {
              return false;
            }
          }
        }
        return true;
      });
      
      // Update display count
      state.displayCount = state.filteredItems.length;
      
      // Re-apply sorting if needed
      if (state.sortField) {
        const sorted = [...state.filteredItems].sort((a, b) => {
          if (a[state.sortField] === null || a[state.sortField] === undefined) return 1;
          if (b[state.sortField] === null || b[state.sortField] === undefined) return -1;
          
          if (typeof a[state.sortField] === 'string') {
            const comparison = a[state.sortField].localeCompare(b[state.sortField]);
            return state.sortDirection === 'asc' ? comparison : -comparison;
          } else {
            const comparison = a[state.sortField] - b[state.sortField];
            return state.sortDirection === 'asc' ? comparison : -comparison;
          }
        });
        
        state.filteredItems = sorted;
      }
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredItems = state.items;
      state.displayCount = state.items.length;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all units
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.filteredItems = action.payload || [];
        state.displayCount = action.payload?.length || 0;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single unit
      .addCase(fetchUnitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnitById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUnit = action.payload;
      })
      .addCase(fetchUnitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add unit
      .addCase(addUnit.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.filteredItems.unshift(action.payload);
        state.displayCount = state.filteredItems.length;
      })
      
      // Edit unit
      .addCase(editUnit.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        const filteredIndex = state.filteredItems.findIndex(item => item.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload;
        }
        
        if (state.currentUnit?.id === action.payload.id) {
          state.currentUnit = action.payload;
        }
      })
      
      // Delete unit
      .addCase(removeUnit.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.filteredItems = state.filteredItems.filter(item => item.id !== action.payload);
        state.displayCount = state.filteredItems.length;
        
        if (state.currentUnit?.id === action.payload) {
          state.currentUnit = null;
        }
      });
  }
});

export const { sortUnits, setFilter, clearFilters } = unitSlice.actions;

export default unitSlice.reducer;
