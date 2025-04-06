"use client";

import React from "react";
import ProductCard from "./ProductCard";
import "./SearchBar.css";

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      <h2 className="results-title">Search Results</h2>
      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <div className="result-content">
              {result.content.split("\n").map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={
                    line.startsWith("Title:")
                      ? "result-title"
                      : line.startsWith("Price:")
                      ? "result-price"
                      : line.startsWith("Rating:")
                      ? "result-rating"
                      : "result-detail"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
            {result.category_name && (
              <div className="result-category">
                Category: {result.category_name}
              </div>
            )}
            {result.link && (
              <div className="result-link">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link-button"
                >
                  View Product
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
