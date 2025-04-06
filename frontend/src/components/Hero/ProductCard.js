import React from "react";

export default function ProductCard({ product }) {
  return (
    <a href="#" className="block no-underline">
      <div className="product-card bg-white rounded-lg shadow-md border border-[var(--border-color)] overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
        <div className="p-5 flex items-start gap-5">
          {/* Product Icon/Image */}
          <div className="icon-container w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg text-3xl shrink-0 border border-gray-100">
            {product.icon}
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                {/* Product Name */}
                <h3 className="product-name text-lg font-semibold text-[var(--text-color)] mb-1 group-hover:text-[var(--primary-color)] transition-colors">
                  {product.name}
                </h3>

                {/* Brand/Author */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span>by {product.author}</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-xl font-bold text-[var(--primary-color)]">
                  {product.price}
                </div>
              </div>
            </div>

            {/* Product Description */}
            <p className="product-description text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
