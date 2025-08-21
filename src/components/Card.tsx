import React from "react";

interface CardProps {
  children: React.ReactNode;
  gradient?: string;     // optional background gradient (like "bg-gradient-to-r from-orange-500 to-pink-500")
  shadow?: boolean;      // enable/disable shadow
  padding?: string;      // custom padding, default: "p-6"
  className?: string;    // extra classes
}

export const Card: React.FC<CardProps> = ({
  children,
  gradient,
  shadow = true,
  padding = "p-6",
  className = "",
}) => (
  <div
    className={`
      relative rounded-2xl border bg-white dark:bg-slate-800 overflow-hidden
      ${shadow ? "shadow-md hover:shadow-lg transition-shadow duration-200" : ""}
      ${className}
    `}
  >
    {/* Optional gradient overlay */}
    {gradient && (
      <div className={`absolute inset-0 ${gradient} opacity-5 pointer-events-none`} />
    )}

    {/* Card content */}
    <div className={`relative ${padding}`}>
      {children}
    </div>
  </div>
);
