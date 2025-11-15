
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { findSimilarProducts } from './services/geminiService';
import { getRandomProducts } from './services/productService';
import type { Product, SimilarityResult, UploadedImage } from './types';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarityResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setSimilarProducts([]);
    setError(null);
  };

  const handleSearch = async () => {
    if (!uploadedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSimilarProducts([]);

    try {
      const productDatabase: Product[] = getRandomProducts(20); // Use a subset for performance
      const results = await findSimilarProducts(uploadedImage, productDatabase);
      
      const matchedProducts = results
        .map(result => {
            const productDetails = productDatabase.find(p => p.id === result.productId);
            return productDetails ? { ...result, ...productDetails } : null;
        })
        .filter((item): item is SimilarityResult & Product => item !== null)
        .sort((a, b) => b.similarityScore - a.similarityScore);
        
      if (matchedProducts.length === 0) {
        setError("Could not find any similar products. Try a different image.");
      }
      setSimilarProducts(matchedProducts);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while searching for products.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSimilarProducts([]);
    setError(null);
    setIsLoading(false);
  };
  
  const hasResults = useMemo(() => similarProducts.length > 0, [similarProducts]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {!hasResults && !isLoading && (
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              onSearch={handleSearch} 
              uploadedImage={uploadedImage} 
              isLoading={isLoading}
            />
          )}

          {isLoading && (
            <Loader message="Analyzing your image and scanning our product database... This may take a moment." />
          )}
          
          <ErrorDisplay message={error} />

          {hasResults && !isLoading && (
            <ResultsDisplay 
              userImage={uploadedImage!}
              results={similarProducts} 
              onReset={handleReset}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
