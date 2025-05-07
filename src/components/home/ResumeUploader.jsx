import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  CircularProgress,
  Alert,
  Fade
} from '@mui/material';
import { Upload, Lock } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export const ResumeUploader = () => {
  const navigate = useNavigate();
  const { setResumeFile, setResumeScore, setResumeAnalysis, setContent } = useResume();
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const parsePDFContent = async (file) => {
    const fileArrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;
    let fullText = '';
    const sections = {
      name: '',
      title: '',
      contact: {
        phone: '',
        email: '',
        location: '',
        linkedin: ''
      },
      summary: '',
      experience: [],
      projects: [],
      skills: []
    };

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str.trim()).filter(Boolean).join('\n');
      fullText += pageText + '\n';
    }

    // Split text into lines and process
    const lines = fullText.split('\n').map(line => line.trim()).filter(Boolean);
    let currentSection = '';
    let currentItem = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // Extract contact information
      if (line.match(/[\w.-]+@[\w.-]+\.\w+/)) {
        sections.contact.email = line.match(/[\w.-]+@[\w.-]+\.\w+/)[0];
        continue;
      }
      if (line.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)) {
        sections.contact.phone = line.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)[0];
        continue;
      }
      if (line.match(/linkedin\.com\/in\/[\w-]+/)) {
        sections.contact.linkedin = line.match(/linkedin\.com\/in\/[\w-]+/)[0];
        continue;
      }

      // Process sections
      if (i === 0) {
        sections.name = line;
      } else if (i === 1 && !lowerLine.includes('summary') && !lowerLine.includes('experience')) {
        sections.title = line;
      } else if (lowerLine.includes('summary') || lowerLine.includes('objective')) {
        currentSection = 'summary';
      } else if (lowerLine.includes('experience') || lowerLine.includes('work history')) {
        currentSection = 'experience';
        currentItem = {};
      } else if (lowerLine.includes('project')) {
        currentSection = 'projects';
        currentItem = {};
      } else if (lowerLine.includes('skills') || lowerLine.includes('technologies')) {
        currentSection = 'skills';
      } else {
        // Process section content
        switch (currentSection) {
          case 'summary':
            if (!lowerLine.includes('experience')) {
              sections.summary += line + ' ';
            }
            break;

          case 'experience':
            if (line.match(/\d{2}\/\d{4}|\d{4}/)) {
              if (Object.keys(currentItem).length > 0) {
                sections.experience.push(currentItem);
              }
              currentItem = { period: line };
            } else if (!currentItem.title) {
              currentItem.title = line;
            } else if (!currentItem.company) {
              currentItem.company = line;
              if (lines[i + 1]?.includes(',')) {
                currentItem.location = lines[i + 1];
                i++;
              }
            } else {
              if (!currentItem.description) currentItem.description = '';
              if (!currentItem.achievements) currentItem.achievements = [];
              
              if (line.startsWith('•') || line.startsWith('-')) {
                currentItem.achievements.push(line.substring(1).trim());
              } else {
                currentItem.description += line + ' ';
              }
            }
            break;

          case 'projects':
            if (!currentItem.name) {
              currentItem.name = line;
            } else if (line.match(/\d{2}\/\d{4}|\d{4}/)) {
              currentItem.period = line;
            } else {
              if (!currentItem.description) {
                currentItem.description = line;
                currentItem.achievements = [];
              } else if (line.startsWith('•') || line.startsWith('-')) {
                currentItem.achievements.push(line.substring(1).trim());
              }
              
              if (lines[i + 1]?.toLowerCase().includes('project') || i === lines.length - 1) {
                sections.projects.push(currentItem);
                currentItem = {};
              }
            }
            break;

          case 'skills':
            const skillsList = line.split(/[,|•]/).map(skill => skill.trim());
            sections.skills.push(...skillsList.filter(skill => skill.length > 0));
            break;
        }
      }
    }

    // Add last experience/project item if exists
    if (Object.keys(currentItem).length > 0) {
      if (currentSection === 'experience') {
        sections.experience.push(currentItem);
      } else if (currentSection === 'projects') {
        sections.projects.push(currentItem);
      }
    }

    return sections;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file.type.includes('pdf') && !file.name.endsWith('.docx')) {
      setError('Please upload a PDF or DOCX file only.');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit.');
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    try {
      const parsedContent = await parsePDFContent(file);
      setContent(parsedContent);
      setResumeFile(file);
      
      const randomScore = Math.floor(Math.random() * 39) + 60;
      setResumeScore(randomScore);
      
      setResumeAnalysis({
        content: { 
          score: Math.floor(Math.random() * 40) + 60,
          items: ['Content Structure', 'Information Clarity', 'Relevant Experience', 'Achievement Focus']
        },
        skills: { 
          score: Math.floor(Math.random() * 25) + 75,
          items: ['Technical Skills', 'Soft Skills', 'Industry Keywords']
        }
      });
      
      setIsUploading(false);
      navigate('/editor');
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setError('Error processing the file. Please try again.');
      setIsUploading(false);
    }
  }, [navigate, setResumeFile, setResumeScore, setResumeAnalysis, setContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: '1px dashed #ccc',
        backgroundColor: 'white',
        transition: 'all 0.3s ease'
      }}
    >
      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      <Box
        {...getRootProps()}
        sx={{
          py: 5,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : '#e0e0e0',
          borderRadius: 2,
          bgcolor: isDragActive ? 'rgba(38, 166, 154, 0.04)' : '#f9f9f9',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.light',
            bgcolor: 'rgba(38, 166, 154, 0.04)'
          }
        }}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} color="primary" sx={{ mb: 2 }} />
            <Typography variant="body1" color="textSecondary">
              Analyzing your resume...
            </Typography>
          </Box>
        ) : (
          <>
            <Upload
              size={48}
              color="#26A69A"
              style={{ marginBottom: 16, opacity: 0.8 }}
            />
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>
              Drop your resume here or choose a file.
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
              PDF & DOCX only. Max 2MB file size.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(38, 166, 154, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(38, 166, 154, 0.3)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Upload Your Resume
            </Button>
          </>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
        <Lock size={14} style={{ opacity: 0.6, marginRight: 6 }} />
        <Typography variant="caption" color="textSecondary">
          Privacy guaranteed
        </Typography>
      </Box>
    </Paper>
  );
};