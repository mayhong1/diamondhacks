"use client";

import React from "react";
import ProductCard from "./ProductCard";

export default function SearchResults({ query }) {
  // Sample data for everyday products
  const sampleProducts = [
    {
      id: 1,
      name: "Premium Red Cotton T-Shirt",
      description:
        "Classic fit, 100% organic cotton t-shirt with reinforced stitching. Machine washable and long-lasting.",
      author: "Fashion Essentials",
      timeAgo: "2 days ago",
      icon: "👕",
      price: "$24.99",
      rating: "4.7",
      reviews: 328,
    },
    {
      id: 2,
      name: "Blue Merino Wool Socks (3-Pack)",
      description:
        "Ultra-comfortable wool blend socks with moisture-wicking technology. Perfect for everyday wear or outdoor activities.",
      author: "Comfort Wear",
      timeAgo: "5 days ago",
      icon: "🧦",
      price: "$19.95",
      rating: "4.8",
      reviews: 453,
    },
    {
      id: 3,
      name: "Leather Minimalist Wallet",
      description:
        "Handcrafted from full-grain leather with RFID protection. Slim profile with space for all essential cards.",
      author: "Modern Essentials",
      timeAgo: "1 week ago",
      icon: "👝",
      price: "$39.99",
      rating: "4.9",
      reviews: 215,
    },
    {
      id: 4,
      name: "Wireless Noise-Canceling Headphones",
      description:
        "Premium sound quality with 30-hour battery life and adjustable noise cancellation. Includes travel case.",
      author: "Audio Pro",
      timeAgo: "3 days ago",
      icon: "🎧",
      price: "$129.99",
      rating: "4.6",
      reviews: 892,
    },
    {
      id: 5,
      name: "Stainless Steel Water Bottle (24oz)",
      description:
        "Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12. BPA-free and eco-friendly.",
      author: "Eco Gear",
      timeAgo: "1 week ago",
      icon: "🍶",
      price: "$34.95",
      rating: "4.7",
      reviews: 576,
    },
  ];

  return (
    <div className="search-results-container mt-12 mb-16 mx-auto">
      <div className="results-header mb-6">
        <h2 className="text-2xl font-semibold text-[var(--text-color)]">
          Results for "{query}"
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Showing {sampleProducts.length} of {sampleProducts.length} results
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
