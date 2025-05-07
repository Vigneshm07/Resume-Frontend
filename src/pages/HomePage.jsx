import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ResumeUploader } from '../components/home/ResumeUploader.jsx';
import { Home as HomeIcon } from 'lucide-react';

export const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            component={RouterLink}
            to="/"
          >
            <HomeIcon size={16} style={{ marginRight: 4 }} />
            Home
          </Link>
          <Typography color="text.primary">Resume Checker</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 6, maxWidth: '800px' }}>
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', md: '3.5rem' }, 
            fontWeight: 800,
            color: '#263238',
            mb: 2,
            lineHeight: 1.2
          }}
        >
          Is your resume good enough?
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#546E7A', 
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: '700px',
            lineHeight: 1.6
          }}
        >
          A free and fast AI resume checker doing 16 crucial checks to ensure your resume
          is ready to perform and get you interview callbacks.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
        <Box sx={{ flex: 1 }}>
          <ResumeUploader />
        </Box>
        
        <Box 
          sx={{ 
            flex: 1, 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img 
            src="https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=600" 
            alt="Resume analysis" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '450px',
              borderRadius: '12px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            }} 
          />
        </Box>
      </Box>
    </Container>
  );
};