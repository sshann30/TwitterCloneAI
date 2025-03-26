import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import TweetCard from '../components/tweet/TweetCard';
import { fetchHomeTimeline } from '../store/slices/tweetSlice';

const mockTrendingTopics = [
  { id: 1, name: '#JavaScript', tweets: 12500, trend: 'up' },
  { id: 2, name: '#React', tweets: 8900, trend: 'up' },
  { id: 3, name: '#SpringBoot', tweets: 5600, trend: 'down' },
  { id: 4, name: '#WebDevelopment', tweets: 3400, trend: 'up' },
  { id: 5, name: '#AI', tweets: 2100, trend: 'up' },
];

const mockSuggestions = [
  {
    id: 1,
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Software Engineer | Tech Enthusiast',
    profileImage: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    username: 'janedoe',
    displayName: 'Jane Doe',
    bio: 'UI/UX Designer | Creative Thinker',
    profileImage: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    username: 'mikejohnson',
    displayName: 'Mike Johnson',
    bio: 'Full Stack Developer | Open Source Contributor',
    profileImage: 'https://via.placeholder.com/150',
  },
];

const Explore = () => {
  const dispatch = useDispatch();
  const { tweets, loading, error } = useSelector((state) => state.tweets);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    dispatch(fetchHomeTimeline());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
      {/* Search Bar */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search Twitter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Main Content */}
        <Box sx={{ flex: 2 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  color: activeTab === 'for-you' ? 'primary.main' : 'text.secondary',
                }}
                onClick={() => handleTabChange('for-you')}
              >
                For you
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  color: activeTab === 'trending' ? 'primary.main' : 'text.secondary',
                }}
                onClick={() => handleTabChange('trending')}
              >
                Trending
              </Typography>
            </Box>
          </Box>

          {/* Tweets */}
          <Box>
            {tweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </Box>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: 1 }}>
          {/* Trending Topics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trending Topics
              </Typography>
              <List>
                {mockTrendingTopics.map((topic) => (
                  <ListItem key={topic.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">{topic.name}</Typography>
                          {topic.trend === 'up' ? (
                            <TrendingUpIcon color="success" fontSize="small" />
                          ) : (
                            <TrendingDownIcon color="error" fontSize="small" />
                          )}
                        </Box>
                      }
                      secondary={`${topic.tweets.toLocaleString()} tweets`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Who to follow */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Who to follow
              </Typography>
              <List>
                {mockSuggestions.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemAvatar>
                      <Avatar src={user.profileImage} alt={user.username}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">{user.displayName}</Typography>
                          <Chip
                            label="Follow"
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            @{user.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.bio}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Explore; 