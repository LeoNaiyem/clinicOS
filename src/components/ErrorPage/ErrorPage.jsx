import React from "react";
import "./ErrorPage.css";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-code-wrapper">
        <div className="error-code">404</div>
        <div className="error-text">Page Not Found</div>
      </div>

      <p className="error-message">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <a href="/" className="back-button">
        <span className="back-text">Back to Home</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="back-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="button-pulse"></span>
      </a>

      <div className="decorative-icon">
        <svg
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="decorative-svg"
        >
          <path
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default ErrorPage;
