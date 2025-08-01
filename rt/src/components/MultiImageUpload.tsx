import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, X, UploadCloud } from 'lucide-react';

interface MultiImageUploadProps {
  onImagesChange: (files: File[]) => void;
  initialImages?: string[];
  required?: boolean;
  maxImages?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onImagesChange,
  initialImages = [],
  required = false,
  maxImages = 5,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize image URLs from initialImages
  useEffect(() => {
    setImageUrls(initialImages);
  }, [initialImages]);

  // Clean up object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [selectedFiles]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage(`File "${file.name}" is not an image.`);
        return false;
      }
      if (selectedFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
        setErrorMessage(`File "${file.name}" is already added.`);
        return false;
      }
      return true;
    });

    if (imageUrls.length + newFiles.length > maxImages) {
      setErrorMessage(`Maximum ${maxImages} images allowed.`);
      return;
    }

    if (newFiles.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prevUrls => [...prevUrls, ...newUrls]);
      onImagesChange([...selectedFiles, ...newFiles]); // Pass all selected files
      setErrorMessage(null);
    } else if (files.length > 0 && newFiles.length === 0) {
      setErrorMessage(errorMessage || 'No valid new image files were added.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedFiles, imageUrls, maxImages, errorMessage, onImagesChange]);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
      setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
      onImagesChange(selectedFiles.filter((_, i) => i !== index));
    },
    [selectedFiles, onImagesChange]
  );

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} cursor-pointer hover:border-blue-400 hover:bg-blue-100`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg font-medium">Drag & drop images here, or click to select files</p>
        <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, GIF, BMP, SVG</p>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {required && selectedFiles.length === 0 && (
        <p className="mt-4 text-red-500 text-sm">At least one image is required</p>
      )}

      {imageUrls.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Selected Images ({imageUrls.length}/{maxImages})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden shadow-md">
                <img src={imageUrl} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
