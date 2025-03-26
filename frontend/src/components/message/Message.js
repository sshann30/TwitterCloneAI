import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import PollComponent from '../poll/PollComponent';

const Message = ({ message }) => {
  const currentUser = useSelector(state => state.auth.user);
  const isOwnMessage = message.senderId === currentUser.id;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      <Paper
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isOwnMessage ? 'primary.light' : 'grey.100'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            src={message.sender.profileImageUrl}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Box>
            <Typography variant="subtitle2">{message.sender.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(message.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1">{message.content}</Typography>

        {message.mediaUrls && message.mediaUrls.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {message.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Media ${index + 1}`}
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            ))}
          </Box>
        )}

        {message.isPollActive && (
          <PollComponent
            poll={message.poll}
            messageId={message.id}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Message; 