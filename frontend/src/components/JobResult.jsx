/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "../styles/JobResult.css";

const JobResult = () => {
  const location = useLocation();
  const jobData = location.state?.jobData;
  const contentRef = useRef(null);

  if (!jobData) {
    return <div>No job data available</div>;
  }

  const features = [
    { key: 'job_title', label: 'Job Title' },
    { key: 'job_location', label: 'Location' },
    { key: 'department', label: 'Department' },
    { key: 'range_of_salary', label: 'Salary Range' },
    { key: 'profile', label: 'Profile' },
    { key: 'job_description', label: 'Description' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'job_benefits', label: 'Benefits' },
    { key: 'telecommunication', label: 'Remote Work' },
    { key: 'company_logo', label: 'Has Company Logo' },
    { key: 'type_of_employment', label: 'Employment Type' },
    { key: 'experience', label: 'Experience' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'type_of_industry', label: 'Industry' },
    { key: 'operations', label: 'Operations' },
    { key: 'fraudulent', label: 'Fraudulent' }
  ];

  const getValue = (key) => {
    const value = jobData[key];
    
    if (value === undefined || value === null) {
      return 'Not specified';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (value === 0 || value === 1) {
      return value === 1 ? 'Yes' : 'No';
    }
    
    if (value === '') {
      return 'Not specified';
    }
    
    return value;
  };

  // Determine if the job is fraudulent
  const isFraudulent = getValue('fraudulent') === 'Yes';

  // Function to download content as PDF
  const downloadAsPDF = () => {
    const content = contentRef.current;
    
    // Get the title to use for the PDF filename
    const jobTitle = getValue('job_title') || 'Job Analysis';
    const fileName = `${jobTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.pdf`;
    
    html2canvas(content, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      scrollY: -window.scrollY // Fix for positioning
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to fit content properly on PDF
      const imgWidth = 210; // A4 width in mm (210mm)
      const pageHeight = 297; // A4 height in mm (297mm)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add image to first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if needed for tall content
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(fileName);
    });
  };

  return (
    <div className="results-container">
      <div className="download-btn-container">
        <button onClick={downloadAsPDF} style={{marginTop:'35px'}} className="download-pdf-btn">
          Download as PDF
        </button>
      </div>
      
      <div className="fraud-indicator">
        {isFraudulent ? (
          <span className="fraud-symbol fraud-symbol-cross">❌</span>
        ) : (
          <span className="fraud-symbol fraud-symbol-tick">✅</span>
        )}
      </div>
      
      <div ref={contentRef}>
        <h2>Job Analysis Results</h2>
        <div className="results-grid">
          {features.map(({ key, label }) => (
            <div key={key} className="result-item">
              <h3>{label}</h3>
              <p>{getValue(key)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobResult;