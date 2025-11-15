
import React from 'react';
import type { Product, SimilarityResult } from '../types';

interface ProductCardProps {
  product: Product & SimilarityResult;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const scoreColor = product.similarityScore > 80 ? 'bg-green-100 text-green-800' :
                     product.similarityScore > 60 ? 'bg-yellow-100 text-yellow-800' :
                     'bg-blue-100 text-blue-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${scoreColor}`}>
          {product.similarityScore}% Match
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
        <h3 className="text-md font-semibold text-gray-800 mt-1 mb-2 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 flex-grow leading-relaxed">&quot;{product.justification}&quot;</p>
      </div>
    </div>
  );
};
