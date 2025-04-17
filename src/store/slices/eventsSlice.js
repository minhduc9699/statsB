import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  selectedEventId: null,
  filterOptions: {
    playerIds: [],
    eventTypes: []
  }
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action) => { state.list.push(action.payload); },
    updateEvent: (state, action) => {
      const idx = state.list.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deleteEvent: (state, action) => {
      state.list = state.list.filter(e => e.id !== action.payload);
    },
    selectEvent: (state, action) => { state.selectedEventId = action.payload; },
    setFilterOptions: (state, action) => { state.filterOptions = action.payload; }
  }
});

export const { addEvent, updateEvent, deleteEvent, selectEvent, setFilterOptions } = eventsSlice.actions;
export default eventsSlice.reducer;
