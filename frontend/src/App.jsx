/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  SignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./styles/App.css";
import Home from "./components/Home";
import CompleteBackend from "./CompleteBackend";
import AboutUs from "./AboutUs";
import UserDashboard from "./components/UserDashboard";
import JobResult from "./components/JobResult";

export default function App() {
  const [theme, setTheme] = useState("Light");
  
  // Apply theme when component mounts and when theme changes
  useEffect(() => {
    if (theme === "Dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "Light" ? "Dark" : "Light"));
  };
  
  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="navbar">
        {/* Logo on the left */}
        <div className="logo">
          <Link to="/">FakeJobDetect</Link>
        </div>
        
        {/* Navigation links on the right */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/aboutus" className="nav-link">About Us</Link>
          {/* <SignedIn>
            <Link to="/userdashboard" className="nav-link">User Dashboard</Link>
          </SignedIn> */}
          {/* Show "Analyze Post" only when user is signed in */}
          <SignedIn>
            <Link to="/analyzepost" className="nav-link">Analyze Post</Link>
          </SignedIn>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "Light" ? "Dark" : "Light"}
          </button>
        </div>
        
        {/* Authentication section */}
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
      </nav>
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs></AboutUs>} />
        {/* <Route path="/userdashboard" element={<UserDashboard></UserDashboard>} /> */}
        {/* <Route path="/contactus" element={<h1>Contact Us</h1>} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1>Welcome to the Dashboard!</h1>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyzepost"
          element={
            <ProtectedRoute>
              <CompleteBackend />
            </ProtectedRoute>
          }
        />
        <Route path="/job-result" element={<JobResult />} />
      </Routes>
    </BrowserRouter>
  );
}