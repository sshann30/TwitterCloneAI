import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { MoreHoriz as MoreIcon } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { vote, removeVote } from '../../store/slices/pollSlice';

const PollComponent = ({ poll, messageId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (poll) {
      setHasVoted(poll.votes[currentUser.id] !== undefined);
      setSelectedOption(poll.votes[currentUser.id]);
      setResults(poll.results);
    }
  }, [poll, currentUser.id]);

  const handleVote = () => {
    if (!selectedOption) return;
    dispatch(vote({ pollId: poll.id, optionId: selectedOption }));
    setHasVoted(true);
  };

  const handleRemoveVote = () => {
    dispatch(removeVote(poll.id));
    setHasVoted(false);
    setSelectedOption(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const calculatePercentage = (optionId) => {
    if (!results) return 0;
    const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
    return totalVotes > 0 ? (results[optionId] / totalVotes) * 100 : 0;
  };

  return (
    <Paper sx={{ p: 2, mt: 1, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {poll.question}
        </Typography>
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Copy poll link</MenuItem>
        <MenuItem onClick={handleMenuClose}>Report poll</MenuItem>
      </Menu>

      <RadioGroup
        value={selectedOption || ''}
        onChange={(e) => setSelectedOption(e.target.value)}
        sx={{ mb: 2 }}
      >
        {Object.entries(poll.options).map(([optionId, optionText]) => (
          <Box key={optionId} sx={{ mb: 1 }}>
            <FormControlLabel
              value={optionId}
              control={<Radio />}
              label={
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2">{optionText}</Typography>
                  {hasVoted && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={calculatePercentage(optionId)}
                        sx={{ flex: 1, height: 4, borderRadius: 2 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(calculatePercentage(optionId))}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
          </Box>
        ))}
      </RadioGroup>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {poll.isActive
            ? `Ends ${formatDistanceToNow(new Date(poll.endTime), { addSuffix: true })}`
            : 'Poll ended'}
        </Typography>
        {!hasVoted ? (
          <Button
            variant="contained"
            size="small"
            onClick={handleVote}
            disabled={!selectedOption}
          >
            Vote
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            onClick={handleRemoveVote}
          >
            Remove vote
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default PollComponent; 