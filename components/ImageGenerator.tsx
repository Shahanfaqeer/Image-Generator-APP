
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';
import { downloadImage } from '../utils/fileUtils';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateImage(prompt);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
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
        <h2 className="text-2xl font-bold text-white">Image Generator</h2>
        <p className="text-slate-400">Describe any image you can imagine, and let our most advanced text-to-image model create it for you.</p>

        <div>
          <label htmlFor="image-gen-prompt" className="block text-sm font-medium text-slate-300 mb-2">
            Image Prompt
          </label>
          <textarea
            id="image-gen-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A photorealistic image of an astronaut riding a horse on Mars."
            rows={4}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm p-2 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <><Spinner /> Generating...</> : 'Generate Image'}
        </button>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="md:col-span-1 lg:col-span-2">
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-center text-slate-300">Generated Image</h3>
            <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                {isLoading && <Spinner className="w-10 h-10"/>}
                {generatedImage && !isLoading && (
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-contain rounded-lg" />
                )}
                {!generatedImage && !isLoading && (
                     <div className="text-center text-slate-500">
                        <Icon name="generate" className="mx-auto h-12 w-12" />
                        <p className="mt-2 text-sm">Your generated image will appear here</p>
                     </div>
                )}
            </div>
            {generatedImage && !isLoading && (
              <button
                onClick={() => downloadImage(generatedImage, 'generated-image.png')}
                className="mt-2 w-full flex justify-center items-center gap-2 bg-slate-700 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-600 transition-colors duration-200"
                aria-label="Download generated image"
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
