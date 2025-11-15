
import React from 'react';

const SparkleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C11.45 2 11 2.45 11 3V4.58C8.24 5.34 6 7.93 6 11C6 11.55 6.45 12 7 12H8.58C9.34 14.76 11.93 17 15 17C15.55 17 16 16.55 16 16V14.42C18.76 13.66 21 11.07 21 8C21 7.45 20.55 7 20 7H18.42C17.66 4.24 15.07 2 12 2Z M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6Z M3 13C3 12.45 2.55 12 2 12S1 12.45 1 13V14.58C1.52 14.89 2 15.4 2 16C2 16.6 1.52 17.11 1 17.42V19C1 19.55 1.45 20 2 20S3 19.55 3 19V17.42C3.48 17.11 4 16.6 4 16C4 15.4 3.48 14.89 3 14.58V13Z M19 18C18.45 18 18 18.45 18 19V20.58C18.52 20.89 19 21.4 19 22C19 22.6 18.52 23.11 18 23.42V25C18 25.55 18.45 26 19 26S20 25.55 20 25V23.42C20.48 23.11 21 22.6 21 22C21 21.4 20.48 20.89 20 20.58V19C20 18.45 19.55 18 19 18Z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <SparkleIcon className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
          Visual Product Matcher
        </h1>
      </div>
    </header>
  );
};
