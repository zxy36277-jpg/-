import React from 'react';
import { ScriptScore } from '../types';
import { Translation } from '../locales';
import { StarIcon, CheckCircleIcon, EditIcon, FilmIcon } from './Icons';

interface ScoreViewProps {
  score: ScriptScore;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
  text: Translation;
}

const ScoreView: React.FC<ScoreViewProps> = ({ score, onContinue, onBack, isLoading, text }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">{text.scoreAnalysis}</h2>
        <p className="text-gray-400">{text.scoreAnalysisDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {/* Relevance */}
         <div className="bg-cinema-800 rounded-2xl p-8 border border-cinema-700 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <h3 className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">{text.relevanceScore}</h3>
            <div className="text-6xl font-bold text-white mb-4 tracking-tighter">
              {score.relevance}<span className="text-2xl text-gray-600">/10</span>
            </div>
            <div className="flex space-x-1">
               {[...Array(10)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`w-4 h-4 ${i < score.relevance ? "text-cyan-400 fill-cyan-400" : "text-gray-700"}`} 
                  />
               ))}
            </div>
         </div>

         {/* Creativity */}
         <div className="bg-cinema-800 rounded-2xl p-8 border border-cinema-700 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <h3 className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">{text.creativityScore}</h3>
            <div className="text-6xl font-bold text-white mb-4 tracking-tighter">
              {score.creativity}<span className="text-2xl text-gray-600">/10</span>
            </div>
             <div className="flex space-x-1">
               {[...Array(10)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`w-4 h-4 ${i < score.creativity ? "text-purple-400 fill-purple-400" : "text-gray-700"}`} 
                  />
               ))}
            </div>
         </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-cinema-800 rounded-2xl p-8 border border-cinema-700 shadow-xl mb-10 relative">
        <div className="absolute top-0 left-8 -translate-y-1/2 bg-cinema-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-cinema-600">
          {text.aiCritique}
        </div>
        <p className="text-lg text-gray-200 leading-relaxed italic text-center">
          "{score.feedback}"
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-4 rounded-xl border border-cinema-600 text-gray-300 hover:bg-cinema-800 hover:text-white font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <EditIcon className="w-5 h-5" />
          <span>{text.btnBackToEdit}</span>
        </button>
        
        <button
          onClick={onContinue}
          disabled={isLoading}
          className="w-full md:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
        >
           {isLoading ? (
             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
           ) : (
             <>
               <FilmIcon className="w-5 h-5" />
               <span>{text.btnGenerateBreakdown}</span>
             </>
           )}
        </button>
      </div>

    </div>
  );
};

export default ScoreView;