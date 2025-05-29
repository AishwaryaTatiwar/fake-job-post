// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import {
//   SignIn,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import "./styles/App.css";
// import Home from "./components/Home";
// import CompleteBackend from "./CompleteBackend";
// import AboutUs from "./AboutUs";
// import UserDashboard from "./components/UserDashboard";
// import JobResult from "./components/JobResult";

// export default function App() {
//   const [theme, setTheme] = useState("Light");
  
//   // Apply theme when component mounts and when theme changes
//   useEffect(() => {
//     if (theme === "Dark") {
//       document.body.classList.add("dark-theme");
//       document.body.classList.remove("light-theme");
//     } else {
//       document.body.classList.add("light-theme");
//       document.body.classList.remove("dark-theme");
//     }
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "Light" ? "Dark" : "Light"));
//   };
  
//   return (
//     <BrowserRouter>
//       {/* Navbar */}
//       <nav className="navbar">
//         {/* Logo on the left */}
//         <div className="logo">
//           <Link to="/">FakeJobDetect</Link>
//         </div>
        
//         {/* Navigation links on the right */}
//         <div className="nav-links">
//           <Link to="/" className="nav-link">Home</Link>
//           <Link to="/aboutus" className="nav-link">About Us</Link>
//           {/* <SignedIn>
//             <Link to="/userdashboard" className="nav-link">User Dashboard</Link>
//           </SignedIn> */}
//           {/* Show "Analyze Post" only when user is signed in */}
//           <SignedIn>
//             <Link to="/analyzepost" className="nav-link">Analyze Post</Link>
//           </SignedIn>
//           <button onClick={toggleTheme} className="theme-toggle-btn">
//             {theme === "Light" ? "Dark" : "Light"}
//           </button>
//         </div>
        
//         {/* Authentication section */}
//         <div className="auth-section">
//           <SignedOut>
//             <SignInButton mode="modal">
//               <button className="get-started-button">Sign In</button>
//             </SignInButton>
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//         </div>
//       </nav>
      
//       {/* Routes */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/aboutus" element={<AboutUs></AboutUs>} />
//         {/* <Route path="/userdashboard" element={<UserDashboard></UserDashboard>} /> */}
//         {/* <Route path="/contactus" element={<h1>Contact Us</h1>} /> */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <h1>Welcome to the Dashboard!</h1>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/analyzepost"
//           element={
//             <ProtectedRoute>
//               <CompleteBackend />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/job-result" element={<JobResult />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }










// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import {
//   SignIn,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
// import { FaHome, FaInfoCircle, FaSearch, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import "./styles/App.css";
// import Home from "./components/Home";
// import CompleteBackend from "./CompleteBackend";
// import AboutUs from "./AboutUs";
// import UserDashboard from "./components/UserDashboard";
// import JobResult from "./components/JobResult";

// export default function App() {
//   const [theme, setTheme] = useState("light");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   // Apply theme when component mounts and when theme changes
//   useEffect(() => {
//     if (theme === "dark") {
//       document.body.classList.add("dark-theme");
//       document.body.classList.remove("light-theme");
//     } else {
//       document.body.classList.add("light-theme");
//       document.body.classList.remove("dark-theme");
//     }
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };
  
//   return (
//     <BrowserRouter>
//       {/* Navbar */}
//       <nav className={`navbar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
//         <div className="navbar-container">
//           {/* Logo on the left */}
//           <div className="logo">
//             <Link to="/">FakeJobDetect</Link>
//           </div>
          
//           {/* Mobile menu button */}
//           <button className="mobile-menu-button" onClick={toggleMobileMenu}>
//             {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//           </button>
          
//           {/* Navigation links on the right */}
//           <div className={`nav-links ${isMobileMenuOpen ? "show" : ""}`}>
//             <Link to="/" className="nav-link">
//               <span className="desktop-text">Home</span>
//               <span className="mobile-icon"><FaHome /></span>
//             </Link>
//             <Link to="/aboutus" className="nav-link">
//               <span className="desktop-text">About Us</span>
//               <span className="mobile-icon"><FaInfoCircle /></span>
//             </Link>
//             <SignedIn>
//               <Link to="/analyzepost" className="nav-link">
//                 <span className="desktop-text">Analyze Post</span>
//                 <span className="mobile-icon"><FaSearch /></span>
//               </Link>
//             </SignedIn>
//             <button onClick={toggleTheme} className="theme-toggle-btn">
//               {theme === "light" ? (
//                 <span className="desktop-text">Dark</span>
//               ) : (
//                 <span className="desktop-text">Light</span>
//               )}
//               <span className="mobile-icon">
//                 {theme === "light" ? <FaMoon /> : <FaSun />}
//               </span>
//             </button>
//           </div>
          
//           {/* Authentication section */}
//           <div className={`auth-section ${isMobileMenuOpen ? "show" : ""}`}>
//             <SignedOut>
//               <SignInButton mode="modal">
//                 <button className="get-started-button">Sign In</button>
//               </SignInButton>
//             </SignedOut>
//             <SignedIn>
//               <UserButton />
//             </SignedIn>
//           </div>
//         </div>
//       </nav>
      
//       {/* Routes */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/aboutus" element={<AboutUs></AboutUs>} />
//         <Route
//           path="/analyzepost"
//           element={
//             <ProtectedRoute>
//               <CompleteBackend />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/job-result" element={<JobResult />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  SignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { FaHome, FaInfoCircle, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./styles/App.css";
import Home from "./components/Home";
import CompleteBackend from "./CompleteBackend";
import AboutUs from "./AboutUs";
import JobResult from "./components/JobResult";

export default function App() {
  const [theme, setTheme] = useState("light");
  
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <Link to="/">TRAP</Link>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <span className="nav-text">Home</span>
              <span className="nav-icon"><FaHome /></span>
            </Link>
            <Link to="/aboutus" className="nav-link">
              <span className="nav-text">About Us</span>
              <span className="nav-icon"><FaInfoCircle /></span>
            </Link>
            <SignedIn>
              <Link to="/analyzepost" className="nav-link">
                <span className="nav-text">Analyze Post</span>
                <span className="nav-icon"><FaSearch /></span>
              </Link>
            </SignedIn>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              <span className="nav-text">{theme === "light" ? "Dark" : "Light"}</span>
              <span className="nav-icon">
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </span>
            </button>
          </div>
          
          <div className="auth-section">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="get-started-button">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route
          path="/analyzepost"
          element={
            <ProtectedRoute>
              <CompleteBackend />
            </ProtectedRoute>
          }
        />
        <Route path="/job-result" element={<JobResult />} />
        <Route path="/aboutus" element={<AboutUs></AboutUs>} />
      </Routes>
    </BrowserRouter>
  );
}
