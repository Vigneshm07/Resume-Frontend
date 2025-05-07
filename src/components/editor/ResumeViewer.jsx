import React, { useState } from 'react';
import { Box, Typography, Skeleton, Button, Paper, TextField, IconButton } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResume } from '../../context/ResumeContext.jsx';
import { Edit2, Save, Plus, Trash2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export const ResumeViewer = () => {
  const { resumeFile, content, setContent } = useResume();
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStructured, setShowStructured] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handleSaveAndDownload = async () => {
    const doc = new jsPDF();
    let yPos = 20;
    const margin = 20;
    const lineHeight = 7;

    // Add name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(content.name, margin, yPos);
    yPos += lineHeight * 2;

    // Add title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(content.title, margin, yPos);
    yPos += lineHeight * 2;

    // Add contact info
    doc.setFontSize(10);
    const contactInfo = `${content.contact.phone} | ${content.contact.email} | ${content.contact.location} | ${content.contact.linkedin}`;
    doc.text(contactInfo, margin, yPos);
    yPos += lineHeight * 2;

    // Add summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(content.summary, 170);
    doc.text(summaryLines, margin, yPos);
    yPos += (summaryLines.length * lineHeight) + lineHeight;

    // Add experience
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Experience', margin, yPos);
    yPos += lineHeight;

    content.experience.forEach(exp => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.title, margin, yPos);
      yPos += lineHeight;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.company} | ${exp.period}${exp.location ? ` | ${exp.location}` : ''}`, margin, yPos);
      yPos += lineHeight;

      const descLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descLines, margin, yPos);
      yPos += (descLines.length * lineHeight);

      if (exp.achievements) {
        exp.achievements.forEach(achievement => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          const achievementLines = doc.splitTextToSize(`• ${achievement}`, 160);
          doc.text(achievementLines, margin + 5, yPos);
          yPos += (achievementLines.length * lineHeight);
        });
      }
      yPos += lineHeight;
    });

    // Add projects
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Projects', margin, yPos);
    yPos += lineHeight;

    content.projects.forEach(project => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(project.name, margin, yPos);
      yPos += lineHeight;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(project.period, margin, yPos);
      yPos += lineHeight;

      const descLines = doc.splitTextToSize(project.description, 170);
      doc.text(descLines, margin, yPos);
      yPos += (descLines.length * lineHeight);

      project.achievements.forEach(achievement => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        const achievementLines = doc.splitTextToSize(`• ${achievement}`, 160);
        doc.text(achievementLines, margin + 5, yPos);
        yPos += (achievementLines.length * lineHeight);
      });
      yPos += lineHeight;
    });

    // Add skills
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Skills', margin, yPos);
    yPos += lineHeight;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const skillsText = content.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, margin, yPos);

    // Save the PDF
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'improved-resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsEditing(false);
  };

  const addExperience = () => {
    setContent(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        period: '',
        location: '',
        description: '',
        achievements: []
      }]
    }));
  };

  const addProject = () => {
    setContent(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        period: '',
        description: '',
        achievements: []
      }]
    }));
  };

  const addSkill = () => {
    setContent(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeExperience = (index) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const removeProject = (index) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const removeSkill = (index) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const renderEditableContent = () => (
    <Box sx={{ p: 3, textAlign: 'left' }}>
      <TextField
        fullWidth
        variant="standard"
        value={content.name}
        onChange={(e) => setContent(prev => ({ ...prev, name: e.target.value }))}
        sx={{ mb: 2, '& input': { fontSize: '2rem', fontWeight: 700, color: '#1a237e' } }}
      />
      
      <TextField
        fullWidth
        variant="standard"
        value={content.title}
        onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          variant="standard"
          label="Phone"
          value={content.contact.phone}
          onChange={(e) => setContent(prev => ({ 
            ...prev, 
            contact: { ...prev.contact, phone: e.target.value }
          }))}
        />
        <TextField
          variant="standard"
          label="Email"
          value={content.contact.email}
          onChange={(e) => setContent(prev => ({ 
            ...prev, 
            contact: { ...prev.contact, email: e.target.value }
          }))}
        />
        <TextField
          variant="standard"
          label="Location"
          value={content.contact.location}
          onChange={(e) => setContent(prev => ({ 
            ...prev, 
            contact: { ...prev.contact, location: e.target.value }
          }))}
        />
        <TextField
          variant="standard"
          label="LinkedIn"
          value={content.contact.linkedin}
          onChange={(e) => setContent(prev => ({ 
            ...prev, 
            contact: { ...prev.contact, linkedin: e.target.value }
          }))}
        />
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>Summary</Typography>
        <TextField
          fullWidth
          multiline
          variant="standard"
          value={content.summary}
          onChange={(e) => setContent(prev => ({ ...prev, summary: e.target.value }))}
        />
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#1a237e', flex: 1 }}>Experience</Typography>
          <Button startIcon={<Plus size={18} />} onClick={addExperience}>Add Experience</Button>
        </Box>
        
        {content.experience.map((exp, index) => (
          <Box key={index} sx={{ mb: 3, position: 'relative' }}>
            <IconButton
              size="small"
              onClick={() => removeExperience(index)}
              sx={{ position: 'absolute', right: -8, top: -8 }}
            >
              <Trash2 size={18} />
            </IconButton>
            
            <TextField
              fullWidth
              variant="standard"
              label="Title"
              value={exp.title}
              onChange={(e) => {
                const newExp = [...content.experience];
                newExp[index] = { ...exp, title: e.target.value };
                setContent(prev => ({ ...prev, experience: newExp }));
              }}
              sx={{ mb: 1 }}
            />
            
            <TextField
              fullWidth
              variant="standard"
              label="Company"
              value={exp.company}
              onChange={(e) => {
                const newExp = [...content.experience];
                newExp[index] = { ...exp, company: e.target.value };
                setContent(prev => ({ ...prev, experience: newExp }));
              }}
              sx={{ mb: 1 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <TextField
                variant="standard"
                label="Period"
                value={exp.period}
                onChange={(e) => {
                  const newExp = [...content.experience];
                  newExp[index] = { ...exp, period: e.target.value };
                  setContent(prev => ({ ...prev, experience: newExp }));
                }}
              />
              
              <TextField
                variant="standard"
                label="Location"
                value={exp.location}
                onChange={(e) => {
                  const newExp = [...content.experience];
                  newExp[index] = { ...exp, location: e.target.value };
                  setContent(prev => ({ ...prev, experience: newExp }));
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              multiline
              variant="standard"
              label="Description"
              value={exp.description}
              onChange={(e) => {
                const newExp = [...content.experience];
                newExp[index] = { ...exp, description: e.target.value };
                setContent(prev => ({ ...prev, experience: newExp }));
              }}
              sx={{ mb: 1 }}
            />
            
            {exp.achievements && exp.achievements.map((achievement, i) => (
              <TextField
                key={i}
                fullWidth
                multiline
                variant="standard"
                label={`Achievement ${i + 1}`}
                value={achievement}
                onChange={(e) => {
                  const newExp = [...content.experience];
                  newExp[index] = {
                    ...exp,
                    achievements: exp.achievements.map((a, j) => 
                      j === i ? e.target.value : a
                    )
                  };
                  setContent(prev => ({ ...prev, experience: newExp }));
                }}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#1a237e', flex: 1 }}>Projects</Typography>
          <Button startIcon={<Plus size={18} />} onClick={addProject}>Add Project</Button>
        </Box>
        
        {content.projects.map((project, index) => (
          <Box key={index} sx={{ mb: 3, position: 'relative' }}>
            <IconButton
              size="small"
              onClick={() => removeProject(index)}
              sx={{ position: 'absolute', right: -8, top: -8 }}
            >
              <Trash2 size={18} />
            </IconButton>
            
            <TextField
              fullWidth
              variant="standard"
              label="Project Name"
              value={project.name}
              onChange={(e) => {
                const newProjects = [...content.projects];
                newProjects[index] = { ...project, name: e.target.value };
                setContent(prev => ({ ...prev, projects: newProjects }));
              }}
              sx={{ mb: 1 }}
            />
            
            <TextField
              fullWidth
              variant="standard"
              label="Period"
              value={project.period}
              onChange={(e) => {
                const newProjects = [...content.projects];
                newProjects[index] = { ...project, period: e.target.value };
                setContent(prev => ({ ...prev, projects: newProjects }));
              }}
              sx={{ mb: 1 }}
            />
            
            <TextField
              fullWidth
              multiline
              variant="standard"
              label="Description"
              value={project.description}
              onChange={(e) => {
                const newProjects = [...content.projects];
                newProjects[index] = { ...project, description: e.target.value };
                setContent(prev => ({ ...prev, projects: newProjects }));
              }}
              sx={{ mb: 1 }}
            />
            
            {project.achievements.map((achievement, i) => (
              <TextField
                key={i}
                fullWidth
                multiline
                variant="standard"
                label={`Achievement ${i + 1}`}
                value={achievement}
                onChange={(e) => {
                  const newProjects = [...content.projects];
                  newProjects[index] = {
                    ...project,
                    achievements: project.achievements.map((a, j) => 
                      j === i ? e.target.value : a
                    )
                  };
                  setContent(prev => ({ ...prev, projects: newProjects }));
                }}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#1a237e', flex: 1 }}>Skills</Typography>
          <Button startIcon={<Plus size={18} />} onClick={addSkill}>Add Skill</Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {content.skills.map((skill, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <IconButton
                size="small"
                onClick={() => removeSkill(index)}
                sx={{ position: 'absolute', right: -8, top: -8, zIndex: 1 }}
              >
                <Trash2 size={14} />
              </IconButton>
              <TextField
                variant="standard"
                value={skill}
                onChange={(e) => {
                  const newSkills = [...content.skills];
                  newSkills[index] = e.target.value;
                  setContent(prev => ({ ...prev, skills: newSkills }));
                }}
                sx={{ minWidth: 120 }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderViewContent = () => (
    <Box sx={{ p: 3, textAlign: 'left' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
        {content.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: '#455a64', mb: 3 }}>
        {content.title}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="body2">📞 {content.contact.phone}</Typography>
        <Typography variant="body2">📧 {content.contact.email}</Typography>
        <Typography variant="body2">📍 {content.contact.location}</Typography>
        <Typography variant="body2">🔗 {content.contact.linkedin}</Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>Summary</Typography>
        <Typography variant="body2">{content.summary}</Typography>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 4 }}>Experience</Typography>
      {content.experience.map((exp, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{exp.title}</Typography>
          <Typography variant="subtitle2" sx={{ color: '#455a64' }}>{exp.company}</Typography>
          <Typography variant="body2" sx={{ color: '#78909c', mb: 1 }}>
            {exp.period} {exp.location && `| ${exp.location}`}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>{exp.description}</Typography>
          {exp.achievements && (
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {exp.achievements.map((achievement, i) => (
                <li key={i}>
                  <Typography variant="body2">{achievement}</Typography>
                </li>
              ))}
            </ul>
          )}
        </Box>
      ))}

      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 4 }}>Projects</Typography>
      {content.projects.map((project, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{project.name}</Typography>
          <Typography variant="body2" sx={{ color: '#78909c', mb: 1 }}>{project.period}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>{project.description}</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {project.achievements.map((achievement, i) => (
              <li key={i}>
                <Typography variant="body2">{achievement}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      ))}

      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 4 }}>Skills</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {content.skills.map((skill, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: '#e3f2fd',
              borderRadius: 2,
              fontSize: '0.875rem'
            }}
          >
            {skill}
          </Paper>
        ))}
      </Box>
    </Box>
  );

  if (!resumeFile) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No resume file uploaded. Please upload a resume to view.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {showStructured && (
          <Button
            variant="contained"
            startIcon={isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            endIcon={isEditing && <Download size={18} />}
            color="primary"
            onClick={() => {
              if (isEditing) {
                handleSaveAndDownload();
              } else {
                setIsEditing(true);
              }
            }}
            sx={{
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(38, 166, 154, 0.2)'
              }
            }}
          >
            {isEditing ? 'Save & Download' : 'Edit Content'}
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<Edit2 size={18} />}
          color="primary"
          onClick={() => {
            setShowStructured(!showStructured);
            setIsEditing(false);
          }}
          sx={{
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(38, 166, 154, 0.2)'
            }
          }}
        >
          {showStructured ? 'Show Original' : 'Edit Resume'}
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' , display:'flex', justifyContent:'center' }}>
        {showStructured ? (
          isEditing ? renderEditableContent() : renderViewContent()
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            {isLoading && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={800} 
                animation="wave"
                sx={{ borderRadius: 2 }}
              />
            )}
            
            <Document
              file={resumeFile}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={800} 
                  animation="wave"
                  sx={{ borderRadius: 2 }}
                />
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page 
                  key={`page_${index + 1}`}
                  pageNumber={index + 1} 
                  width={550}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </Box>
        )}
      </Box>
    </Box>
  );
};