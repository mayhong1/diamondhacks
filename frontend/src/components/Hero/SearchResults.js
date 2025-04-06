"use client";

import React from "react";
import "./SearchBar.css";

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      <h2 className="results-title">Search Results</h2>
      <div className="results-list">
        {results.map((result, index) => {
          // Extract data from the content string
          const titleMatch = result.content.match(/Title: (.*?)(?:\n|$)/);
          const priceMatch = result.content.match(/Price: (.*?)(?:\n|$)/);
          const ratingMatch = result.content.match(/Rating: (.*?)(?:\n|$)/);

          const title = titleMatch ? titleMatch[1] : "Product";
          const price = priceMatch ? priceMatch[1] : "Price not available";
          const rating = ratingMatch ? ratingMatch[1] : null;

          return (
            <div key={index} className="result-card">
              <h3 className="result-title">{title}</h3>
              <div className="result-price">{price}</div>
              {rating && <div className="result-rating">{rating}</div>}
              {result.link && (
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link-button"
                >
                  View Product
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
