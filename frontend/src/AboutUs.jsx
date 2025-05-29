// /* eslint-disable no-unused-vars */
// import React from 'react';
// import './styles/AboutUS.css'; // Import the CSS file for styling
// import aboutUsImage from './Images/login-page-banner.png'; // Import your image

// const AboutUs = () => {
//   return (
//     <div className="about-us-container">
//       <div className="about-us-content">
//         <h1>About Us</h1>
//         <p>
//         At <strong>FakeJobDetect</strong>, we are committed to protecting job seekers from fraudulent job postings and scams. In today’s digital age, fake job opportunities have become increasingly prevalent, leaving countless individuals vulnerable to exploitation. Our mission is to empower job seekers with the tools and resources they need to identify and avoid fraudulent job listings.
//         </p>
//         <p>
//         Whether you are a fresh graduate or an experienced professional, FakeJobDetect is your trusted partner in navigating the job market safely and confidently. Together, we can create a safer, more transparent job-seeking experience for everyone.
//         </p>
//       </div>
//       <div className="about-us-image">
//         <img src={aboutUsImage} alt="About Us" />
//       </div>
//     </div>
//   );
// };

// export default AboutUs;


















// import React from 'react';
// import './styles/AboutUS.css';
// import aboutUsImage from './Images/login-page-banner.png';
// import { FaShieldAlt, FaSearch, FaUsers, FaChartLine } from 'react-icons/fa';

// const AboutUs = () => {
//   return (
//     <div className="about-us-page">
//       <div className="hero-image-container">
//         <img src={aboutUsImage} alt="Job Security" className="hero-image" />
//         <div className="hero-overlay"></div>
//       </div>

//       <div className="about-us-container">
//         <div className="about-us-content">
//           <h1 className="title-animate">About <span>TRAP</span></h1>
//           <p className="fade-in">
//             At <strong>TRAP</strong>, we are committed to protecting job seekers from fraudulent job postings and scams. In today's digital age, fake job opportunities have become increasingly prevalent, leaving countless individuals vulnerable to exploitation.
//           </p>
//           <p className="fade-in">
//             Our mission is to empower job seekers with the tools and resources they need to identify and avoid fraudulent job listings. Whether you are a fresh graduate or an experienced professional, TRAP is your trusted partner in navigating the job market safely and confidently.
//           </p>
//         </div>

//         <div className="features-grid">
//           <div className="feature-card scale-in">
//             <FaShieldAlt className="feature-icon" />
//             <h3>Protection</h3>
//             <p>Advanced algorithms to detect fraudulent listings</p>
//           </div>
          
//           <div className="feature-card scale-in">
//             <FaSearch className="feature-icon" />
//             <h3>Verification</h3>
//             <p>Real-time analysis of job postings</p>
//           </div>
          
//           <div className="feature-card scale-in">
//             <FaUsers className="feature-icon" />
//             <h3>Community</h3>
//             <p>Join thousands of protected job seekers</p>
//           </div>
          
//           <div className="feature-card scale-in">
//             <FaChartLine className="feature-icon" />
//             <h3>Growth</h3>
//             <p>Focus on real opportunities for your career</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;

















import React from 'react';
import './styles/AboutUS.css';
import aboutUsImage from './Images/login-page-banner.png';
import { FaShieldAlt, FaSearch, FaUsers, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="title-animate">About <span>TRAP</span></h1>
          <p className="hero-text fade-in">
            Protecting job seekers from fraudulent postings with advanced detection technology
          </p>
        </div>
        <img src={aboutUsImage} alt="Job Security" className="hero-image" />
      </div>

      <div className="content-wrapper">
        <div className="about-us-container">
          <div className="about-us-content">
            <div className="text-section">
              <h2>Our Mission</h2>
              <p className="fade-in">
                At <strong>TRAP</strong>, we are committed to protecting job seekers from fraudulent job postings and scams. In today's digital age, fake job opportunities have become increasingly prevalent, leaving countless individuals vulnerable to exploitation.
              </p>
              <p className="fade-in">
                Our mission is to empower job seekers with the tools and resources they need to identify and avoid fraudulent job listings. Whether you are a fresh graduate or an experienced professional, TRAP is your trusted partner in navigating the job market safely and confidently.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card scale-in">
                <FaShieldAlt className="feature-icon" />
                <h3>Protection</h3>
                <p>Advanced algorithms to detect fraudulent listings</p>
              </div>
              
              <div className="feature-card scale-in">
                <FaSearch className="feature-icon" />
                <h3>Verification</h3>
                <p>Real-time analysis of job postings</p>
              </div>
              
              <div className="feature-card scale-in">
                <FaUsers className="feature-icon" />
                <h3>Community</h3>
                <p>Join thousands of protected job seekers</p>
              </div>
              
              <div className="feature-card scale-in">
                <FaChartLine className="feature-icon" />
                <h3>Growth</h3>
                <p>Focus on real opportunities for your career</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;