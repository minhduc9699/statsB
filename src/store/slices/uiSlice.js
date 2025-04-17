import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showPlayerModal: false,
  showExportModal: false,
  activeTab: 'main',
  toastMessages: []
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowPlayerModal: (state, action) => { state.showPlayerModal = action.payload; },
    setShowExportModal: (state, action) => { state.showExportModal = action.payload; },
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
    addToastMessage: (state, action) => { state.toastMessages.push(action.payload); },
    clearToastMessages: (state) => { state.toastMessages = []; }
  }
});

export const { setShowPlayerModal, setShowExportModal, setActiveTab, addToastMessage, clearToastMessages } = uiSlice.actions;
export default uiSlice.reducer;
