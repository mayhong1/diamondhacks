import React from "react";
import "./SearchBar.css";

const ImagePreview = ({ imagePreview, searchQuery, onClearImage }) => {
  return (
    <div className="image-preview-container">
      <div className="image-preview">
        <img src={imagePreview} alt="Preview" />
        <button
          type="button"
          className="clear-image-button"
          onClick={onClearImage}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="image-search-hint">
        Searching with image +{" "}
        {searchQuery ? `"${searchQuery}"` : "auto-detected content"}
      </div>
    </div>
  );
};

export default ImagePreview;
