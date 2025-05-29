// /* eslint-disable no-unused-vars */
// import React from "react";
// import "../styles/Home.css"; // Import the CSS file for the Home component
// import {
//   SignIn,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";

// const Home = () => {
//   return (
//     <div className="home-container">
//       <div className="welcome-message">
//         <h1>Welcome to Fake Job Post Detection</h1>
//         <p>
//           Protect yourself from fraudulent job postings with our advanced
//           detection system. Get started today and secure your career!
//         </p>
//         <SignedOut>
//             <SignInButton mode="modal">
//               <button className="get-started-button">Get Started</button>
//             </SignInButton>
//           </SignedOut>
//       </div>
//       <div className="welcome-image">
//           <img 
//             src="https://professional.dce.harvard.edu/wp-content/uploads/sites/9/2022/08/why-is-professional-development-important.jpg" 
//             alt="Illustration showing job safety" 
//             className="image" 
//           />
//       </div>
//     </div>
//   );
// };

// export default Home;



/* eslint-disable no-unused-vars */
import React from "react";
import "../styles/Home.css";
import {
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-image animate-image">
        <img
          src="https://professional.dce.harvard.edu/wp-content/uploads/sites/9/2022/08/why-is-professional-development-important.jpg"
          alt="Illustration showing job safety"
          className="image"
        />
      </div>
      <div className="welcome-message fade-in">
        <h1>Welcome to <span className="highlight-text">TRAP</span> <span>- A Fake Job Post Detection System</span></h1>
        <p>
          Protect yourself from fraudulent job postings with our advanced
          detection system. Get started today and secure your career!
        </p>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="cta-button">Get Started</button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Home;
