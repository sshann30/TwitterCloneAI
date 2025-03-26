import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import TweetCard from '../components/tweet/TweetCard';
import { fetchUserTweets } from '../store/slices/tweetSlice';

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { tweets, loading, error } = useSelector((state) => state.tweets);
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: Fetch user profile data
    // For now, using mock data
    setUser({
      username,
      displayName: 'John Doe',
      bio: 'Software Engineer | Tech Enthusiast | Coffee Lover',
      location: 'San Francisco, CA',
      website: 'https://example.com',
      joinDate: 'January 2020',
      following: 1234,
      followers: 5678,
      profileImage: 'https://via.placeholder.com/150',
      coverImage: 'https://via.placeholder.com/1500x500',
    });

    dispatch(fetchUserTweets(username));
  }, [username, dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const isOwnProfile = currentUser?.username === username;

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
      {/* Cover Image */}
      <Box
        sx={{
          height: 200,
          backgroundImage: `url(${user?.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          mb: -4,
        }}
      />

      {/* Profile Header */}
      <Box sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Avatar
            src={user?.profileImage}
            alt={user?.username}
            sx={{ width: 120, height: 120, border: '4px solid white' }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          {isOwnProfile ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 2 }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Follow
            </Button>
          )}
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {user?.displayName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          @{user?.username}
        </Typography>

        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.bio}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 1, color: 'text.secondary' }}>
          {user?.location && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ fontSize: 20, mr: 0.5 }} />
              <Typography variant="body2">{user?.location}</Typography>
            </Box>
          )}
          {user?.website && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkIcon sx={{ fontSize: 20, mr: 0.5 }} />
              <Typography variant="body2" component="a" href={user?.website} target="_blank" rel="noopener noreferrer">
                {user?.website}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ fontSize: 20, mr: 0.5 }} />
            <Typography variant="body2">Joined {user?.joinDate}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Typography variant="body2">
            <strong>{user?.following}</strong> Following
          </Typography>
          <Typography variant="body2">
            <strong>{user?.followers}</strong> Followers
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Tweets" />
          <Tab label="Tweets & replies" />
          <Tab label="Media" />
          <Tab label="Likes" />
        </Tabs>
      </Box>

      {/* Tweets */}
      <Box sx={{ mt: 2 }}>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
        {tweets.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            No tweets yet
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profile; 