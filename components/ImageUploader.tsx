
import React, { useState, useRef, useCallback } from 'react';
import type { UploadedImage } from '../types';
import { fileToBase64, urlToBase64 } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  onSearch: () => void;
  uploadedImage: UploadedImage | null;
  isLoading: boolean;
}

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const LinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onSearch, uploadedImage, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setError(null);
      try {
        const { base64, mimeType } = await fileToBase64(file);
        onImageUpload({ base64, mimeType, source: file.name });
      } catch (err) {
        setError('Failed to read image file.');
      }
    }
  };

  const handleUrlSubmit = async () => {
    if (!url) {
      setError('Please enter an image URL.');
      return;
    }
    setError(null);
    try {
      const { base64, mimeType } = await urlToBase64(url);
      onImageUpload({ base64, mimeType, source: url });
    } catch (err) {
      setError('Failed to fetch image from URL. Please check the URL and CORS policy.');
      console.error(err);
    }
  };

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        setError(null);
        try {
          const { base64, mimeType } = await fileToBase64(file);
          onImageUpload({ base64, mimeType, source: file.name });
          setActiveTab('upload');
        } catch (err) {
          setError('Failed to read dropped image file.');
        }
      } else {
        setError('Please drop a valid image file.');
      }
  }, [onImageUpload]);
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };


  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300">
        {!uploadedImage ? (
             <div>
                <div className="mb-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('upload')} className={`${activeTab === 'upload' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                           <UploadIcon className="w-5 h-5 mr-2" /> Upload File
                        </button>
                        <button onClick={() => setActiveTab('url')} className={`${activeTab === 'url' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                           <LinkIcon className="w-5 h-5 mr-2" /> Paste URL
                        </button>
                    </nav>
                </div>
                {activeTab === 'upload' && (
                  <div 
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    <div className="space-y-1 text-center">
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                  </div>
                )}
                {activeTab === 'url' && (
                    <div className="mt-4 flex rounded-md shadow-sm">
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"/>
                        <button onClick={handleUrlSubmit} type="button" className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                           Fetch
                        </button>
                    </div>
                )}
                 {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        ) : (
            <div className="text-center">
                <p className="text-lg font-medium text-gray-800 mb-4">Image Ready for Analysis</p>
                <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`} alt="Uploaded preview" className="max-h-60 mx-auto rounded-lg shadow-md mb-4"/>
                <p className="text-sm text-gray-500 truncate mb-6" title={uploadedImage.source}>Source: {uploadedImage.source}</p>
                <button
                    onClick={onSearch}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? 'Searching...' : 'Find Similar Products'}
                </button>
            </div>
        )}
    </div>
  );
};
