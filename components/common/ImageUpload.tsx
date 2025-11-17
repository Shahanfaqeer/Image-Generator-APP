
import React, { useCallback, useRef } from 'react';
import type { ImageFile } from '../../types';
import { fileToDataUrl } from '../../utils/fileUtils';
import { Icon } from './Icon';

interface ImageUploadProps {
  onFileSelect: (imageFile: ImageFile) => void;
  previewUrl: string | null;
  label: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, previewUrl, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      onFileSelect({ file, dataUrl });
    }
  }, [onFileSelect]);

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div
        onClick={handleAreaClick}
        className="relative w-full aspect-square bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200"
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center text-slate-500">
            <Icon name="upload" className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">Click to browse or drag & drop</p>
          </div>
        )}
      </div>
    </div>
  );
};
