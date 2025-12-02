import React, { useState } from 'react';
import { ScriptScore, ScriptSegment } from '../types';
import { StarIcon, ImageIcon, VideoIcon, CopyIcon, FilmIcon } from './Icons';
import { Translation } from '../locales';

interface FinalDashboardProps {
  score: ScriptScore;
  segments: ScriptSegment[];
  originalIdea: string;
  onRestart: () => void;
  text: Translation;
}

const FinalDashboard: React.FC<FinalDashboardProps> = ({ score, segments, originalIdea, onRestart, text }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (textStr: string, id: number) => {
    navigator.clipboard.writeText(textStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-fade-in">
      
      {/* Mini Score Summary Header */}
      <div className="bg-cinema-800 rounded-xl p-4 border border-cinema-700 flex flex-wrap justify-between items-center shadow-lg mb-10">
         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs font-bold uppercase">{text.relevanceScore}</span>
              <span className="text-white font-bold text-xl">{score.relevance}/10</span>
            </div>
            <div className="w-px h-8 bg-cinema-700"></div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs font-bold uppercase">{text.creativityScore}</span>
              <span className="text-white font-bold text-xl">{score.creativity}/10</span>
            </div>
         </div>
         <div className="hidden md:block text-gray-400 text-sm italic border-l border-cinema-700 pl-6 ml-6 truncate max-w-md">
            "{score.feedback}"
         </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FilmIcon className="w-6 h-6 mr-3 text-cinema-500" />
          {text.prodBreakdown}
        </h2>
        <button 
          onClick={onRestart}
          className="px-4 py-2 text-sm bg-cinema-700 hover:bg-cinema-600 text-white rounded-lg transition-colors border border-cinema-600"
        >
          {text.newProject}
        </button>
      </div>

      {/* Segments List */}
      <div className="space-y-12">
        {segments.map((segment) => (
          <div key={segment.id} className="relative bg-cinema-800 rounded-2xl border border-cinema-700 overflow-hidden shadow-2xl">
            
            {/* Segment Header */}
            <div className="bg-cinema-900/50 p-4 border-b border-cinema-700 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center space-x-4">
                <span className="bg-cinema-700 text-white font-mono text-sm px-3 py-1 rounded">
                  {segment.duration}
                </span>
                <span className="text-cinema-400 font-bold">{text.shot} #{segment.id}</span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Context */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{text.sceneContext}</h3>
                <p className="text-white text-lg leading-relaxed font-medium">
                  {segment.sceneContent}
                </p>
              </div>

              {/* Prompts */}
              <div className="lg:col-span-8 grid grid-cols-1 gap-6">
                
                {/* Image Prompt */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 group relative hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-emerald-400 space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{text.imgPrompt}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(segment.imagePrompt, segment.id * 100 + 1)}
                      className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
                      title="Copy"
                    >
                      {copiedId === segment.id * 100 + 1 ? <span className="text-green-500 text-xs font-bold">{text.copied}</span> : <CopyIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm font-mono leading-relaxed break-words">
                    {segment.imagePrompt}
                  </p>
                </div>

                {/* Video Prompt */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 group relative hover:border-rose-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-rose-400 space-x-2">
                      <VideoIcon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{text.vidPrompt}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(segment.videoPrompt, segment.id * 100 + 2)}
                      className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
                      title="Copy"
                    >
                      {copiedId === segment.id * 100 + 2 ? <span className="text-green-500 text-xs font-bold">{text.copied}</span> : <CopyIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm font-mono leading-relaxed break-words">
                    {segment.videoPrompt}
                  </p>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalDashboard;