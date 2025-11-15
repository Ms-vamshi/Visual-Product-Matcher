
import React, { useState, useMemo } from 'react';
import type { Product, SimilarityResult, UploadedImage } from '../types';
import { ProductCard } from './ProductCard';

interface ResultsDisplayProps {
  userImage: UploadedImage;
  results: (SimilarityResult & Product)[];
  onReset: () => void;
}

const FilterIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ userImage, results, onReset }) => {
  const [similarityThreshold, setSimilarityThreshold] = useState(50);

  const filteredResults = useMemo(() => {
    return results.filter(r => r.similarityScore >= similarityThreshold);
  }, [results, similarityThreshold]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8 p-6 bg-white rounded-xl shadow-lg">
        <div className="w-full md:w-1/3 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Image</h2>
            <img src={`data:${userImage.mimeType};base64,${userImage.base64}`} alt="User upload" className="rounded-lg shadow-md mx-auto" />
            <button onClick={onReset} className="mt-6 w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                Start New Search
            </button>
        </div>
        <div className="w-full md:w-2/3">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Similar Products Found</h2>
                <span className="text-sm text-gray-500 mt-2 sm:mt-0">{filteredResults.length} of {results.length} showing</span>
            </div>
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <label htmlFor="similarity" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    Similarity Threshold: <span className="font-bold text-indigo-600 ml-2">{similarityThreshold}%</span>
                </label>
                <input
                    id="similarity"
                    type="range"
                    min="0"
                    max="100"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 px-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">No Matches Found</h3>
                    <p className="mt-2 text-sm text-gray-500">Try adjusting the similarity threshold or starting a new search with a different image.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
