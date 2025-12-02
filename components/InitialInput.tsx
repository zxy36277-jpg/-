import React, { useState } from 'react';
import { WandIcon } from './Icons';
import { Translation } from '../locales';

interface InitialInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
  text: Translation;
}

const InitialInput: React.FC<InitialInputProps> = ({ onSubmit, isLoading, text }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onSubmit(idea);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-cinema-800 rounded-2xl shadow-2xl border border-cinema-700 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Script <span className="text-cinema-500">Forge</span>
        </h1>
        <p className="text-gray-400 text-lg">
          {text.tagline}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-300 mb-2">
            {text.labelIdea}
          </label>
          <textarea
            id="idea"
            rows={6}
            className="w-full bg-cinema-900 text-white rounded-lg border border-cinema-700 p-4 focus:ring-2 focus:ring-cinema-500 focus:border-transparent outline-none transition-all resize-none placeholder-gray-600"
            placeholder={text.placeholder}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!idea.trim() || isLoading}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
            !idea.trim() || isLoading
              ? 'bg-cinema-700 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{text.btnGenerating}</span>
            </>
          ) : (
            <>
              <WandIcon className="w-5 h-5" />
              <span>{text.btnGenerate}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InitialInput;
