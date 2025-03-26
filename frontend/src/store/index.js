import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tweetReducer from './slices/tweetSlice';
import messageReducer from './slices/messageSlice';
import pollReducer from './slices/pollSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
    messages: messageReducer,
    polls: pollReducer
  }
}); 