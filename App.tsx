
import React, { useState } from 'react';
import { ImageStudio } from './components/ImageStudio';
import { MockupGenerator } from './components/MockupGenerator';
import { ImageGenerator } from './components/ImageGenerator';
import { Icon } from './components/common/Icon';

type Tab = 'studio' | 'mockups' | 'generator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('studio');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'studio':
        return <ImageStudio />;
      case 'mockups':
        return <MockupGenerator />;
      case 'generator':
        return <ImageGenerator />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label, iconName }: { tab: Tab; label: string; iconName: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
        activeTab === tab
          ? 'bg-indigo-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <Icon name={iconName} className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Icon name="logo" className="w-8 h-8 text-indigo-500" />
              <h1 className="text-xl font-bold text-white">Creative Suite AI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
              <TabButton tab="studio" label="Image Studio" iconName="edit" />
              <TabButton tab="mockups" label="Mockup Generator" iconName="mockup" />
              <TabButton tab="generator" label="Image Generator" iconName="generate" />
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderTabContent()}
      </main>
      
      {/* Mobile Tab Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-2">
          <TabButton tab="studio" label="Studio" iconName="edit" />
          <TabButton tab="mockups" label="Mockups" iconName="mockup" />
          <TabButton tab="generator" label="Generate" iconName="generate" />
      </nav>
    </div>
  );
};

export default App;
