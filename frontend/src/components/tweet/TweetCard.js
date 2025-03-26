import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Link,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Repeat,
  Share,
  MoreHoriz,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { likeTweet, unlikeTweet, retweet } from '../../store/slices/tweetSlice';

const TweetCard = ({ tweet }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    try {
      if (tweet.likedBy.includes(user.id)) {
        await dispatch(unlikeTweet(tweet.id)).unwrap();
      } else {
        await dispatch(likeTweet(tweet.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to like/unlike tweet:', error);
    }
  };

  const handleRetweet = async () => {
    try {
      await dispatch(retweet(tweet.id)).unwrap();
    } catch (error) {
      console.error('Failed to retweet:', error);
    }
  };

  const renderTweetContent = () => {
    if (tweet.isRetweet) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Repeat sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Retweeted
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', gap: 2, p: 2 }}>
        <Avatar
          src={tweet.user?.profileImageUrl}
          alt={tweet.user?.displayName}
          sx={{ width: 48, height: 48 }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {tweet.user?.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              @{tweet.user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ·
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreHoriz />
            </IconButton>
          </Box>
          {renderTweetContent()}
          <Typography variant="body1" sx={{ mb: 1 }}>
            {tweet.content}
          </Typography>
          {tweet.mediaUrls?.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              {tweet.mediaUrls.map((url, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  image={url}
                  alt={`Media ${index + 1}`}
                  sx={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small">
                <ChatBubbleOutline fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {tweet.replyCount}
                </Typography>
              </IconButton>
              <IconButton size="small" onClick={handleRetweet}>
                <Repeat fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {tweet.retweetCount}
                </Typography>
              </IconButton>
              <IconButton size="small" onClick={handleLike}>
                {tweet.likedBy.includes(user.id) ? (
                  <Favorite fontSize="small" color="error" />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {tweet.likeCount}
                </Typography>
              </IconButton>
              <IconButton size="small">
                <Share fontSize="small" />
              </IconButton>
            </Box>
            <IconButton size="small">
              {tweet.bookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Copy link to Tweet</MenuItem>
        <MenuItem onClick={handleMenuClose}>Embed Tweet</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>Report Tweet</MenuItem>
      </Menu>
    </Card>
  );
};

export default TweetCard; 