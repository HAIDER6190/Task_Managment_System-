import React from "react";
import { FiLoader } from "react-icons/fi";

export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/10"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
      {label && (
        <p className="mt-4 text-sm text-gray-400">{label}</p>
      )}
    </div>
  );
}
