import React from "react";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="glass-card-dark p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
