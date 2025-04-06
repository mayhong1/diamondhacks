import React from "react";

const Card = ({
  children,
  className = "",
  hover = true,
  image,
  onClick,
  ...props
}) => {
  const baseStyles = `
    relative 
    bg-white 
    rounded-xl 
    overflow-hidden 
    transition-all 
    duration-300 
    border 
    border-gray-100
    ${hover ? "hover:shadow-lg hover:scale-[1.02] hover:border-primary/20" : ""}
    ${onClick ? "cursor-pointer" : ""}
  `;

  return (
    <div className={`${baseStyles} ${className}`} onClick={onClick} {...props}>
      {image && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={image}
            alt="Card image"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

// Card Title Component
const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

// Card Description Component
const CardDescription = ({ children, className = "" }) => {
  return <p className={`text-gray-600 ${className}`}>{children}</p>;
};

// Card Footer Component
const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

// Card Content Component
const CardContent = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
};
