
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-center items-center mb-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
      <p className="text-md font-medium text-gray-700">{message}</p>
    </div>
  );
};
