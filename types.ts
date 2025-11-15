
export interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  source: string; // URL or filename
}

export interface SimilarityResult {
  productId: string;
  similarityScore: number;
  justification: string;
}
