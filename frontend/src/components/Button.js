import React from "react";

export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "gradient-btn",
    secondary: "px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20",
    danger: "px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30",
    ghost: "px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={18} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={18} />}
    </button>
  );
}
