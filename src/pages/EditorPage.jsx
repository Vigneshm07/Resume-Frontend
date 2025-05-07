import React from 'react';
import { Container, Grid, Box, Typography, Paper, Button } from '@mui/material';
import { useResume } from '../context/ResumeContext.jsx';
import { ResumeViewer } from '../components/editor/ResumeViewer.jsx';
import { ScoreDisplay } from '../components/editor/ScoreDisplay.jsx';
import { AnalysisSection } from '../components/editor/AnalysisSection.jsx';
import { ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

export const EditorPage = () => {
  const { resumeScore, resumeAnalysis } = useResume();

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowLeft size={18} />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Resume Analysis
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7} lg={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, md: 3 }, 
              borderRadius: 3, 
              height: '100%',
              bgcolor: 'white',
              border: '1px solid #eaeaea',
            }}
          >
            <ResumeViewer />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <Box sx={{ mb: 3 }}>
            <ScoreDisplay score={resumeScore} />
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              borderRadius: 3, 
              bgcolor: 'white',
              border: '1px solid #eaeaea',
            }}
          >
            <AnalysisSection 
              title="Content Analysis" 
              score={resumeAnalysis.content.score} 
              items={resumeAnalysis.content.items}
            />
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              mt: 3,
              p: 3,
              borderRadius: 3, 
              bgcolor: 'white',
              border: '1px solid #eaeaea',
            }}
          >
            <AnalysisSection 
              title="Skills Analysis" 
              score={resumeAnalysis.skills.score} 
              items={resumeAnalysis.skills.items}
              compact
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};