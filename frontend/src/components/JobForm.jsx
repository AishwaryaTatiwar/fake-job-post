/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import { FiUpload } from "react-icons/fi";

const JobForm = ({ setJobData, setLoading, setError }) => {
  const [url, setUrl] = useState("");
  const [jobPost, setJobPost] = useState("");
  const [platform, setPlatform] = useState("");
  const [extractingText, setExtractingText] = useState(false);
  const [hasLogo, setHasLogo] = useState(false); // Toggle for company logo
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [employment, setEmployment] = useState("");
  const [hasQuestion, setHasQuestion] = useState(false); // Toggle for company logo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("https://job-validator-2.onrender.com//api/analyze2", {
        url: url || null,
        job_post: jobPost || null,
        platform: platform || null,
        has_logo: hasLogo,
        experience: experience || null,
        education: education || null,
        employment: employment || null,
        hasQuestion: hasQuestion || null,
      }
    );
    
      setJobData(response.data);
      console.log(response.data)
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "An error occurred while analyzing the job posting"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtractingText(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });
      setJobPost(text);
    } catch (error) {
      console.error("OCR Error:", error);
      setError("Failed to extract text from image");
    } finally {
      setExtractingText(false);
    }
  };
  const experience_order = [
    "Not Provided",
    "Not Applicable",
    "Internship (0-1)",
    "Entry level (0-2)",
    "Associate (1-3)",
    "Mid-Senior level (4-7)",
    "Director (8-12)",
    "Executive (12+)",
  ];

  const education_order = [
    "Not Provided",
    "Unspecified",
    "Some High School Coursework",
    "High School or equivalent",
    "Vocational - HS Diploma",
    "Some College Coursework Completed",
    "Certification",
    "Vocational",
    "Vocational - Degree",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Professional",
  ];

  const employment_order = [
    "Not Provided",
    "Other",
    "Temporary",
    "Contract",
    "Part-time",
    "Full-time",
  ];

  return (
    <div className="form-container" style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* URL Input */}
        <div style={styles.formGroup}>
          <label htmlFor="url" style={styles.label}>
            Job URL
          </label>
          <input
            id="url"
            type="text"
            placeholder="Paste job URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Image Upload with Toggle */}
        <div style={styles.formGroup}>
          <div style={styles.uploadContainer}>
            <label htmlFor="imageUpload" style={styles.uploadLabel}>
              <FiUpload
                size={16}
                style={{ marginRight: "8px", color: "#fff" }}
              />
              Upload Job Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <div style={{ color: "black" }}>has company logo?</div>
            {/* Toggle Button */}
            <div
              onClick={() => setHasLogo((prev) => !prev)}
              style={{
                ...styles.toggle,
                backgroundColor: hasLogo ? "green" : "black",
              }}
            >
              <div
                style={{
                  ...styles.toggleDot,
                  marginLeft: hasLogo ? "20px" : "2px",
                }}
              />
            </div>
          </div>

          {extractingText && (
            <p style={styles.extractingText}>Extracting text from image...</p>
          )}
        </div>

        {/* Job Platform Dropdown */}
        <div style={styles.formGroup} className="platform-dropdown">
          <label htmlFor="platform" style={styles.label}>
            Select Job Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Choose a Platform --</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Naukri">Naukri</option>
            <option value="Internshala">Internshala</option>
            <option value="Unstop">Unstop</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Job Post Textarea */}
        <div style={styles.formGroup}>
          <label htmlFor="jobPost" style={styles.label}>
            Job Description
          </label>
          <textarea
            id="jobPost"
            placeholder="Paste job post content here..."
            value={jobPost}
            onChange={(e) => setJobPost(e.target.value)}
            style={styles.textarea}
            rows={6}
          />
        </div>

        {/* Experience Level Dropdown */}
        <div style={styles.formGroup} className="platform-dropdown">
          <label htmlFor="experience" style={styles.label}>
            Experience Level
          </label>
          <select
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Experience --</option>
            {experience_order.map((level, idx) => (
              <option key={idx} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Education Level Dropdown */}
        <div style={styles.formGroup} className="platform-dropdown">
          <label htmlFor="education" style={styles.label}>
            Education Level
          </label>
          <select
            id="education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Education --</option>
            {education_order.map((level, idx) => (
              <option key={idx} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Employment Type Dropdown */}
        <div style={styles.formGroup} className="platform-dropdown">
          <label htmlFor="employment" style={styles.label}>
            Employment Type
          </label>
          <select
            id="employment"
            value={employment}
            onChange={(e) => setEmployment(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Employment --</option>
            {employment_order.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
        <label htmlFor="employment" style={styles.label}>
        Are there any question given in the job post?
          </label>
          <select
            id="hasQuestion"
            value={hasQuestion}
            onChange={(e) => setHasQuestion(e.target.value)}
            style={styles.select}
          >
            <option value={true}>yes</option>
            <option value={false}>No</option>
            
          </select>
        </div>

        <button type="submit" style={styles.button}>
          Analyze Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;

const styles = {
  container: {
    maxWidth: "600px",
    height: "auto",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f7f9fc",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    marginBottom: "6px",
    color: "#333",
    fontWeight: "500",
  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  uploadContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#00BFFF",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "400",
    transition: "all 0.2s ease",
    width: "fit-content",
  },
  toggle: {
    width: "40px",
    height: "20px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  toggleDot: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "white",
    transition: "margin-left 0.3s ease",
  },
  extractingText: {
    fontStyle: "italic",
    fontSize: "12px",
    marginTop: "4px",
    color: "#718096",
  },
  select: {
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    outline: "none",
  },
  textarea: {
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    resize: "vertical",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4a90e2",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};
