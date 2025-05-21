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
import JobResult from "./components/JobResult";

export default function App() {
  const [theme, setTheme] = useState("Light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === "Dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "Light" ? "Dark" : "Light"));
  const handleHamburgerClick = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <BrowserRouter>
      {/* Hamburger icon (shown only when sidebar is closed) */}
      {!sidebarOpen && (
        <button
          className="hamburger"
          onClick={handleHamburgerClick}
          aria-label="Open sidebar"
        >
          ☰
        </button>
      )}

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="sidebar-overlay active" onClick={closeSidebar}></div>}

      {/* Navbar / Sidebar */}
      <nav className={`navbar${sidebarOpen ? " active" : ""}`}>
        {/* Close (X) icon inside sidebar */}
        {sidebarOpen && (
          <button
            className="hamburgerclose"
            onClick={handleHamburgerClick}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}

        <div className="logo">
          <Link to="/" onClick={closeSidebar}>FakeJobDetect</Link>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link" id="home" onClick={closeSidebar}>Home</Link>
          <Link to="/aboutus" className="nav-link" onClick={closeSidebar}>About Us</Link>
          <SignedIn>
            <Link to="/analyzepost" className="nav-link" onClick={closeSidebar}>Analyze Post</Link>
          </SignedIn>
          <button onClick={() => { toggleTheme(); closeSidebar(); }} className="theme-toggle-btn">
            {theme === "Light" ? "Dark" : "Light"}
          </button>
        </div>

        {/* Auth section (used in desktop sidebar) */}
        <div className="auth-section desktop-auth">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="get-started-button"  onClick={closeSidebar}>Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Auth section fixed at top-right for mobile */}
      <div className="auth-section mobile-auth">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="get-started-button">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="mobile-user"><UserButton /></div>
        </SignedIn>
      </div>

      <main id="main-content" className={sidebarOpen ? "sidebar-open" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
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
      </main>
    </BrowserRouter>
  );
}
