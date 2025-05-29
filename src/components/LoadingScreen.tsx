import React from "react";

interface LoadingScreenProps {
  className?: string;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
};
