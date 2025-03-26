import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@mui/material';
import { Send as SendIcon, Search as SearchIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = useSelector(state => state.auth.user);

  // Mock data for initial development
  useEffect(() => {
    setConversations([
      {
        id: '1',
        user: {
          id: '2',
          username: 'john_doe',
          name: 'John Doe',
          profileImageUrl: 'https://via.placeholder.com/40'
        },
        lastMessage: 'Hey, how are you?',
        timestamp: new Date(),
        unreadCount: 2
      },
      {
        id: '2',
        user: {
          id: '3',
          username: 'jane_smith',
          name: 'Jane Smith',
          profileImageUrl: 'https://via.placeholder.com/40'
        },
        lastMessage: 'See you tomorrow!',
        timestamp: new Date(),
        unreadCount: 0
      }
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.id,
      timestamp: new Date(),
      isRead: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Conversations List */}
      <Paper sx={{ width: 350, borderRight: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Messages</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Direct Messages"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Box>
        <List sx={{ p: 0 }}>
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.id}
              button
              selected={selectedConversation?.id === conversation.id}
              onClick={() => setSelectedConversation(conversation)}
            >
              <ListItemAvatar>
                <Avatar src={conversation.user.profileImageUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={conversation.user.name}
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography>
                }
              />
              {conversation.unreadCount > 0 && (
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  {conversation.unreadCount}
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={selectedConversation.user.profileImageUrl} sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1">{selectedConversation.user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{selectedConversation.user.username}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Messages List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.senderId === currentUser.id ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: message.senderId === currentUser.id ? 'primary.light' : 'grey.100'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <form onSubmit={handleSendMessage}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <IconButton type="submit" color="primary">
                    <SendIcon />
                  </IconButton>
                </Box>
              </form>
            </Paper>
          </>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography>Select a conversation to start messaging</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Messages; 