import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Button,
  Typography,
  Avatar,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Image as ImageIcon,
  Close as CloseIcon,
  EmojiEmotions as EmojiIcon,
  LocationOn as LocationIcon,
  Poll as PollIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { createTweet } from '../../store/slices/tweetSlice';

const MAX_CHARS = 280;
const MAX_MEDIA = 4;

const TweetCompose = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef(null);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharCount(newContent.length);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + mediaUrls.length > MAX_MEDIA) {
      alert(`You can only upload up to ${MAX_MEDIA} images`);
      return;
    }

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaUrls((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload only image files');
      }
    });
  };

  const handleRemoveImage = (index) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) {
      alert('Please enter some content or upload an image');
      return;
    }

    try {
      await dispatch(createTweet({
        content: content.trim(),
        mediaUrls,
      })).unwrap();
      
      // Reset form
      setContent('');
      setMediaUrls([]);
      setCharCount(0);
    } catch (error) {
      console.error('Failed to create tweet:', error);
      alert('Failed to create tweet. Please try again.');
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            src={user?.profileImage}
            alt={user?.username}
            sx={{ width: 48, height: 48 }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's happening?"
                value={content}
                onChange={handleContentChange}
                variant="standard"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '1.1rem',
                  },
                }}
              />
              {mediaUrls.length > 0 && (
                <ImageList cols={2} rowHeight={164} sx={{ mt: 1 }}>
                  {mediaUrls.map((url, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        loading="lazy"
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{ color: 'white' }}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={mediaUrls.length >= MAX_MEDIA}
                  >
                    <ImageIcon />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                  <IconButton size="small">
                    <EmojiIcon />
                  </IconButton>
                  <IconButton size="small">
                    <PollIcon />
                  </IconButton>
                  <IconButton size="small">
                    <LocationIcon />
                  </IconButton>
                  <IconButton size="small">
                    <ScheduleIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="body2"
                    color={charCount > MAX_CHARS ? 'error' : 'text.secondary'}
                  >
                    {charCount}/{MAX_CHARS}
                  </Typography>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!content.trim() && mediaUrls.length === 0}
                  >
                    Tweet
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TweetCompose; 