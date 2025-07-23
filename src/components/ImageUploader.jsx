// ImageUploader.jsx
import React, { useState } from 'react';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';

const ImageUploader = ({ onUpload, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('File size must be less than 2MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      
      // Call the upload handler with the file
      await onUpload(file);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
      setPreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview('');
    setError(null);
    onUpload(null);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-contain rounded-md"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <FiX className="text-red-500" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <div className="text-center">
            <FiUpload className="text-gray-400 text-2xl mb-2 mx-auto" />
            <span className="text-sm text-gray-600">Click to upload</span>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 2MB)</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}
      
      {isUploading && (
        <div className="mt-2 text-sm text-blue-600">Uploading...</div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
};

export default ImageUploader;