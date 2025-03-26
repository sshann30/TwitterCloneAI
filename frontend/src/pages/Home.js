import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import TweetCompose from '../components/tweet/TweetCompose';
import TweetCard from '../components/tweet/TweetCard';
import { fetchHomeTimeline } from '../store/slices/tweetSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { tweets, loading, error } = useSelector((state) => state.tweets);

  useEffect(() => {
    dispatch(fetchHomeTimeline());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <TweetCompose />
      <Box sx={{ mt: 4 }}>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
        {tweets.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            No tweets yet. Be the first to tweet!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Home; 