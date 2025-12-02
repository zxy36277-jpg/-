import React, { useState } from 'react';
import { EditIcon, CheckCircleIcon, RefreshCwIcon, FilmIcon, WandIcon } from './Icons';
import { Translation } from '../locales';

interface ScriptReviewProps {
  script: string;
  onUpdateScript: (newScript: string) => void;
  onAnalyze: () => void;
  onRefine: (feedback: string) => void;
  isRefining: boolean;
  isAnalyzing: boolean;
  text: Translation;
}

// Helper to render script with basic markdown bold support
const FormattedScript: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="font-mono text-sm md:text-base leading-relaxed text-gray-800 space-y-4">
      {content.split('\n').map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-4" />;
        
        // Basic Markdown Bold Parser
        const parts = line.split(/(\*\*.*?\*\*)/g);
        
        return (
          <div key={index} className="whitespace-pre-wrap">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={i} className="font-bold text-black">{part.slice(2, -2)}</span>;
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const ScriptReview: React.FC<ScriptReviewProps> = ({ 
  script, 
  onUpdateScript, 
  onAnalyze, 
  onRefine, 
  isRefining,
  isAnalyzing,
  text
}) => {
  const [feedback, setFeedback] = useState('');
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [localScript, setLocalScript] = useState(script);

  const handleManualSave = () => {
    onUpdateScript(localScript);
    setMode('view');
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onRefine(feedback);
      setFeedback('');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-auto min-h-[85vh]">
      
      {/* Left Column: Script Display/Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header Toolbar */}
        <div className="bg-cinema-800 p-4 rounded-t-xl border border-cinema-700 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cinema-700 rounded-lg">
              <FilmIcon className="text-white w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-white tracking-wide">{text.screenplay}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {mode === 'view' ? (
              <button 
                onClick={() => { setLocalScript(script); setMode('edit'); }}
                className="text-xs font-medium flex items-center space-x-2 px-4 py-2 bg-cinema-700 text-gray-200 border border-cinema-600 rounded-lg hover:bg-cinema-600 transition-all"
              >
                <EditIcon className="w-3 h-3" />
                <span>{text.manualEdit}</span>
              </button>
            ) : (
               <button 
                onClick={handleManualSave}
                className="text-xs font-medium flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                <CheckCircleIcon className="w-3 h-3" />
                <span>{text.saveEdits}</span>
              </button>
            )}
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 relative bg-neutral-200 p-2 md:p-8 rounded-b-xl border-x border-b border-cinema-700 shadow-2xl overflow-hidden min-h-[600px]">
          <div className="absolute inset-2 md:inset-8 bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
             {mode === 'view' ? (
              <div className="w-full h-full overflow-y-auto p-8 md:p-12 bg-white">
                <FormattedScript content={script} />
              </div>
            ) : (
              <textarea
                value={localScript}
                onChange={(e) => setLocalScript(e.target.value)}
                className="w-full h-full p-8 md:p-12 font-mono text-sm md:text-base leading-relaxed resize-none outline-none text-gray-900 bg-white"
                spellCheck={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="w-full lg:w-96 flex flex-col space-y-6">
        
        {/* AI Refinement Box */}
        <div className="bg-cinema-800 rounded-2xl p-6 border border-cinema-700 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
             <WandIcon className="w-5 h-5 text-purple-400" />
             <h3 className="text-white font-bold text-lg">{text.aiNotes}</h3>
          </div>
          
          <p className="text-sm text-gray-400 mb-5 leading-relaxed">
            {text.aiNotesDesc}
          </p>
          
          <form onSubmit={handleRefineSubmit} className="space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={text.placeholderFeedback}
              className="w-full h-32 bg-cinema-900/50 border border-cinema-700 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none resize-none transition-all"
              disabled={isRefining}
            />
            <button
              type="submit"
              disabled={!feedback.trim() || isRefining}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
                !feedback.trim() || isRefining
                ? 'bg-cinema-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30'
              }`}
            >
              {isRefining ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <RefreshCwIcon className="w-4 h-4" />
                  <span>{text.btnRegenerate}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Action Box */}
        <div className="bg-cinema-800 rounded-2xl p-6 border border-cinema-700 shadow-xl flex-1 flex flex-col justify-end">
          <div className="mb-6">
             <div className="h-1 w-12 bg-green-500 rounded-full mb-4"></div>
             <h3 className="text-white font-bold text-lg mb-2">{text.btnAnalyze}</h3>
             <p className="text-sm text-gray-400">
               {text.happyWithScript}
             </p>
          </div>
          
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || isRefining}
            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                <span>{text.btnAnalyze}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ScriptReview;