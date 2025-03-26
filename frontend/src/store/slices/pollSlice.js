import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

export const createPoll = createAsyncThunk(
  'polls/createPoll',
  async ({ messageId, question, options, endTime }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/polls/create`, {
        messageId,
        question,
        options,
        endTime
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const vote = createAsyncThunk(
  'polls/vote',
  async ({ pollId, optionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/polls/${pollId}/vote`, {
        optionId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeVote = createAsyncThunk(
  'polls/removeVote',
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/polls/${pollId}/vote`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPollResults = createAsyncThunk(
  'polls/getResults',
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/polls/${pollId}/results`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const pollSlice = createSlice({
  name: 'polls',
  initialState: {
    polls: {},
    loading: false,
    error: null
  },
  reducers: {
    updatePoll: (state, action) => {
      const poll = action.payload;
      state.polls[poll.id] = poll;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Poll
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.polls[action.payload.id] = action.payload;
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote
      .addCase(vote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vote.fulfilled, (state, action) => {
        state.loading = false;
        state.polls[action.payload.id] = action.payload;
      })
      .addCase(vote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Vote
      .addCase(removeVote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVote.fulfilled, (state, action) => {
        state.loading = false;
        state.polls[action.payload.id] = action.payload;
      })
      .addCase(removeVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Results
      .addCase(getPollResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPollResults.fulfilled, (state, action) => {
        state.loading = false;
        const pollId = action.payload.id;
        if (state.polls[pollId]) {
          state.polls[pollId] = { ...state.polls[pollId], ...action.payload };
        }
      })
      .addCase(getPollResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updatePoll } = pollSlice.actions;
export default pollSlice.reducer; 