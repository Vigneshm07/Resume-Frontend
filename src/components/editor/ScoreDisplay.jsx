import React from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

export const ScoreDisplay = ({ score }) => {
  const getColorByScore = (score) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 75) return '#8BC34A';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'white',
        border: '1px solid #eaeaea',
        display: 'flex',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={80}
          thickness={4}
          sx={{ color: '#f0f0f0' }}
        />
        <CircularProgress
          variant="determinate"
          value={score}
          size={80}
          thickness={4}
          sx={{
            color: getColorByScore(score),
            position: 'absolute',
            left: 0,
            transition: 'all 1s ease-in-out',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" component="div" fontWeight="bold">
            {score}
            <Typography component="span" variant="caption" sx={{ position: 'absolute', fontSize: '0.6rem' }}>
              /100
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ ml: { sm: 2 } }}>
        <Typography variant="h6" fontWeight={600} textAlign={{ xs: 'center', sm: 'left' }}>
          Resume Score
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign={{ xs: 'center', sm: 'left' }}>
          {score >= 90
            ? 'Excellent! Your resume is highly optimized.'
            : score >= 75
              ? 'Good resume with some room for improvement.'
              : score >= 60
                ? 'Average resume. Several improvements needed.'
                : 'Your resume needs significant improvements.'}
        </Typography>
      </Box>
    </Paper>
  );
};