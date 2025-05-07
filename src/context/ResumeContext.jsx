import React, { createContext, useState, useContext } from 'react';

const ResumeContext = createContext(undefined);

export const ResumeProvider = ({ children }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeScore, setResumeScore] = useState(0);
  const [resumeAnalysis, setResumeAnalysis] = useState({
    content: { score: 0, items: [] },
    skills: { score: 0, items: [] }
  });
  const [content, setContent] = useState({
    name: "",
    title: "",
    contact: {
      phone: "",
      email: "",
      location: "",
      linkedin: ""
    },
    summary: "",
    experience: [],
    projects: [],
    skills: []
  });

  const resetResume = () => {
    setResumeFile(null);
    setResumeScore(0);
    setResumeAnalysis({
      content: { score: 0, items: [] },
      skills: { score: 0, items: [] }
    });
    setContent({
      name: "",
      title: "",
      contact: {
        phone: "",
        email: "",
        location: "",
        linkedin: ""
      },
      summary: "",
      experience: [],
      projects: [],
      skills: []
    });
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeFile,
        resumeScore,
        resumeAnalysis,
        content,
        setResumeFile,
        setResumeScore,
        setResumeAnalysis,
        setContent,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};