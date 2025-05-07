import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from '@mui/material';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';

export const AnalysisSection = ({ title, score, items, compact = false }) => {
  const getStatusIcon = (index) => {
    // Randomly determine the status of each item
    const rand = Math.random();
    
    if (rand > 0.7) {
      return <CheckCircle size={16} color="#4CAF50" />;
    } else if (rand > 0.4) {
      return <AlertCircle size={16} color="#FFC107" />;
    } else {
      return <Circle size={16} color="#F44336" />;
    }
  };

  const getColorByScore = (score) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 75) return '#8BC34A';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  return (
    <Box>
      {!compact && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Typography variant="body2" fontWeight={500} color={getColorByScore(score)}>
              {score}/100
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 3,
              bgcolor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: getColorByScore(score),
              },
            }}
          />
        </>
      )}

      {compact && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="body2" fontWeight={500} color={getColorByScore(score)}>
            {score}/100
          </Typography>
        </Box>
      )}

      <List disablePadding dense={compact}>
        {items.map((item, index) => (
          <ListItem key={index} disableGutters sx={{ py: compact ? 0.5 : 1 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              {getStatusIcon(index)}
            </ListItemIcon>
            <ListItemText 
              primary={item} 
              primaryTypographyProps={{ 
                variant: compact ? 'body2' : 'body1',
                fontWeight: 500 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};