import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createTweet = createAsyncThunk(
  'tweets/createTweet',
  async (tweetData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/tweets', tweetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeTweet = createAsyncThunk(
  'tweets/likeTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      await axios.post(`/tweets/${tweetId}/like`);
      return tweetId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unlikeTweet = createAsyncThunk(
  'tweets/unlikeTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      await axios.delete(`/tweets/${tweetId}/like`);
      return tweetId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const retweet = createAsyncThunk(
  'tweets/retweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/tweets/${tweetId}/retweet`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchHomeTimeline = createAsyncThunk(
  'tweets/fetchHomeTimeline',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/tweets/timeline');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserTweets = createAsyncThunk(
  'tweets/fetchUserTweets',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/tweets/user/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  tweets: [],
  loading: false,
  error: null,
};

const tweetSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Tweet
      .addCase(createTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets.unshift(action.payload);
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Tweet
      .addCase(likeTweet.fulfilled, (state, action) => {
        const tweet = state.tweets.find((t) => t.id === action.payload);
        if (tweet) {
          tweet.likedBy.push(action.payload);
          tweet.likeCount += 1;
        }
      })
      // Unlike Tweet
      .addCase(unlikeTweet.fulfilled, (state, action) => {
        const tweet = state.tweets.find((t) => t.id === action.payload);
        if (tweet) {
          tweet.likedBy = tweet.likedBy.filter((id) => id !== action.payload);
          tweet.likeCount -= 1;
        }
      })
      // Retweet
      .addCase(retweet.fulfilled, (state, action) => {
        state.tweets.unshift(action.payload);
      })
      // Fetch Home Timeline
      .addCase(fetchHomeTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
      })
      .addCase(fetchHomeTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Tweets
      .addCase(fetchUserTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
      })
      .addCase(fetchUserTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = tweetSlice.actions;
export default tweetSlice.reducer; 