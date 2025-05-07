import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eaeaea' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FileText size={28} color={theme.palette.primary.main} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                color: theme.palette.primary.main, 
                fontWeight: 700, 
                ml: 1,
                fontSize: isMobile ? '1.1rem' : '1.25rem'
              }}
            >
              ResumeAI
            </Typography>
          </RouterLink>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isMobile && (
              <>
                <Button color="inherit" component={RouterLink} to="/">
                  Home
                </Button>
                <Button color="inherit">Pricing</Button>
                <Button color="inherit">Blog</Button>
              </>
            )}
            <Button 
              variant="contained" 
              color="primary"
              component={RouterLink} 
              to="/" 
              sx={{ 
                color: 'white',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(38, 166, 154, 0.2)'
                }
              }}
            >
              My Documents
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};