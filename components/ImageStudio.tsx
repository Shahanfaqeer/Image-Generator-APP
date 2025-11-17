
import React, { useState } from 'react';
import type { ImageFile } from '../types';
import { fileToBase64, downloadImage } from '../utils/fileUtils';
import { editImage } from '../services/geminiService';
import { ImageUpload } from './common/ImageUpload';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';

export const ImageStudio: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Image = await fileToBase64(originalImage.file);
      const resultBase64 = await editImage(base64Image, originalImage.file.type, prompt);
      setEditedImage(`data:image/png;base64,${resultBase64}`);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-1 bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white">Image Studio</h2>
        <p className="text-slate-400">Upload an image and describe the changes you want to make. Let AI bring your vision to life.</p>
        
        <ImageUpload 
          onFileSelect={setOriginalImage} 
          previewUrl={originalImage?.dataUrl || null} 
          label="Upload Image"
        />

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
            Editing Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Make it black and white, add a cat wearing a party hat."
            rows={3}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm p-2 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !originalImage || !prompt}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <><Spinner /> Editing...</> : 'Edit Image'}
        </button>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="md:col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-center text-slate-300">Original</h3>
            <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                {originalImage ? (
                    <img src={originalImage.dataUrl} alt="Original" className="w-full h-full object-contain rounded-lg" />
                ) : (
                    <p className="text-slate-500">Upload an image to start</p>
                )}
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-center text-slate-300">Edited</h3>
            <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                {isLoading && <Spinner className="w-10 h-10"/>}
                {editedImage && !isLoading && (
                    <img src={editedImage} alt="Edited" className="w-full h-full object-contain rounded-lg" />
                )}
                {!editedImage && !isLoading && (
                     <p className="text-slate-500">Your edited image will appear here</p>
                )}
            </div>
            {editedImage && !isLoading && (
              <button
                onClick={() => downloadImage(editedImage, 'edited-image.png')}
                className="mt-2 w-full flex justify-center items-center gap-2 bg-slate-700 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-600 transition-colors duration-200"
                aria-label="Download edited image"
              >
                <Icon name="download" className="w-5 h-5" />
                Download Image
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
