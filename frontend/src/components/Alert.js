import React from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export default function Alert({ children, variant = "info" }) {
  const variants = {
    error: {
      bg: "bg-red-500/10 border-red-500/30",
      text: "text-red-400",
      icon: FiAlertCircle,
    },
    success: {
      bg: "bg-green-500/10 border-green-500/30",
      text: "text-green-400",
      icon: FiCheckCircle,
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-500/30",
      text: "text-amber-400",
      icon: FiAlertTriangle,
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-400",
      icon: FiInfo,
    },
  };

  const { bg, text, icon: Icon } = variants[variant] || variants.info;

  return (
    <div className={`flex items-start gap-3 ${bg} border rounded-xl p-4 mb-4 animate-fade-in`}>
      <Icon className={`${text} flex-shrink-0 mt-0.5`} size={18} />
      <p className={`text-sm ${text}`}>{children}</p>
    </div>
  );
}
