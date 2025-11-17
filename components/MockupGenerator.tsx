
import React, { useState } from 'react';
import type { ImageFile } from '../types';
import { fileToBase64, downloadImage } from '../utils/fileUtils';
import { generateMockup } from '../services/geminiService';
import { ImageUpload } from './common/ImageUpload';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';

const MOCKUP_OPTIONS = [
  { id: 'tshirt', name: 'White T-Shirt', prompt: 'A professional studio product photo of a plain white t-shirt on a hanger, with this logo printed clearly in the center.' },
  { id: 'mug', name: 'Black Mug', prompt: 'A professional studio product photo of a glossy black ceramic coffee mug, with this logo printed clearly on the side.' },
  { id: 'bag', name: 'Tote Bag', prompt: 'A high-quality product shot of a canvas tote bag with this logo printed on it, sitting on a wooden surface.' },
  { id: 'hat', name: 'Baseball Cap', prompt: 'A clean product photo of a navy blue baseball cap with this logo embroidered on the front.' },
  { id: 'custom', name: 'Custom Prompt', prompt: '' },
];

export const MockupGenerator: React.FC = () => {
  const [logo, setLogo] = useState<ImageFile | null>(null);
  const [selectedMockup, setSelectedMockup] = useState(MOCKUP_OPTIONS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const promptToSend = selectedMockup.id === 'custom' ? customPrompt : selectedMockup.prompt;
    
    if (!logo || !promptToSend) {
      setError('Please upload a logo and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMockup(null);

    try {
      const base64Logo = await fileToBase64(logo.file);
      const resultBase64 = await generateMockup(base64Logo, logo.file.type, promptToSend);
      setGeneratedMockup(`data:image/png;base64,${resultBase64}`);
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
        <h2 className="text-2xl font-bold text-white">Mockup Generator</h2>
        <p className="text-slate-400">Upload your logo, choose a product, and instantly see it on a high-quality mockup.</p>
        
        <ImageUpload 
          onFileSelect={setLogo} 
          previewUrl={logo?.dataUrl || null} 
          label="Upload Your Logo"
        />

        <div>
          <label htmlFor="mockup-type" className="block text-sm font-medium text-slate-300 mb-2">
            Select Product
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MOCKUP_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedMockup(option)}
                className={`p-3 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                  selectedMockup.id === option.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
        
        {selectedMockup.id === 'custom' && (
          <div>
            <label htmlFor="custom-prompt" className="block text-sm font-medium text-slate-300 mb-2">
              Custom Mockup Prompt
            </label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., A photo of a person wearing a black t-shirt with this logo on it, standing in a city street."
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm p-2 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !logo || (selectedMockup.id === 'custom' && !customPrompt)}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <><Spinner /> Generating...</> : 'Generate Mockup'}
        </button>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="md:col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-center text-slate-300">Your Logo</h3>
            <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                {logo ? (
                    <img src={logo.dataUrl} alt="Logo" className="w-full h-full object-contain rounded-lg p-4" />
                ) : (
                    <p className="text-slate-500">Upload a logo to start</p>
                )}
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-center text-slate-300">Generated Mockup</h3>
            <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                {isLoading && <Spinner className="w-10 h-10"/>}
                {generatedMockup && !isLoading && (
                    <img src={generatedMockup} alt="Generated Mockup" className="w-full h-full object-contain rounded-lg" />
                )}
                {!generatedMockup && !isLoading && (
                     <p className="text-slate-500">Your mockup will appear here</p>
                )}
            </div>
            {generatedMockup && !isLoading && (
              <button
                onClick={() => downloadImage(generatedMockup, 'mockup.png')}
                className="mt-2 w-full flex justify-center items-center gap-2 bg-slate-700 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-600 transition-colors duration-200"
                aria-label="Download mockup"
              >
                <Icon name="download" className="w-5 h-5" />
                Download Mockup
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
