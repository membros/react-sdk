import React from "react";

interface InadimplentScreenProps {
  className?: string;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const InadimplentScreen: React.FC<InadimplentScreenProps> = ({
  className = "",
  title = "Subscription Required",
  description = "You need an active subscription to access this content.",
  actionText = "Subscribe Now",
  onAction
}) => {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl max-w-md text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}; 