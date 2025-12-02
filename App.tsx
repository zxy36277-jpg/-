
import React, { useState } from 'react';
import { AppState, AppStep } from './types';
import * as geminiService from './services/geminiService';
import InitialInput from './components/InitialInput';
import ScriptReview from './components/ScriptReview';
import ScoreView from './components/ScoreView';
import FinalDashboard from './components/FinalDashboard';
import { translations } from './locales';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: AppStep.INPUT_IDEA,
    language: 'en',
    userIdea: '',
    currentScript: '',
    score: null,
    segments: [],
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);
  const t = translations[state.language];

  // STEP 1: Generate initial script
  const handleInitialSubmit = async (idea: string) => {
    setIsLoading(true);
    setLoadingText(t.btnGenerating);
    setState(prev => ({ ...prev, error: null }));
    try {
      const script = await geminiService.generateCreativeScript(idea, state.language);
      setState(prev => ({
        ...prev,
        step: AppStep.REVIEW_SCRIPT,
        userIdea: idea,
        currentScript: script
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: t.errorGen }));
    } finally {
      setIsLoading(false);
      setLoadingText(undefined);
    }
  };

  // STEP 2: Update script (manual edit)
  const handleUpdateScript = (newScript: string) => {
    setState(prev => ({ ...prev, currentScript: newScript }));
  };

  // STEP 2: Refine script (AI)
  const handleRefineScript = async (feedback: string) => {
    setIsLoading(true);
    setLoadingText(undefined);
    try {
      const newScript = await geminiService.refineScript(state.currentScript, feedback, state.userIdea, state.language);
      setState(prev => ({ ...prev, currentScript: newScript }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: t.errorRefine }));
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Analyze Script (Scoring)
  const handleAnalyzeScript = async () => {
    setIsLoading(true);
    setLoadingText(undefined);
    try {
      const score = await geminiService.evaluateScript(state.userIdea, state.currentScript, state.language);
      setState(prev => ({
        ...prev,
        step: AppStep.SCORE_PREVIEW,
        score
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: t.errorEval }));
    } finally {
      setIsLoading(false);
    }
  };

  // Back to edit from score view
  const handleBackToEdit = () => {
    setState(prev => ({ ...prev, step: AppStep.REVIEW_SCRIPT }));
  };

  // STEP 4: Generate Breakdown
  const handleGenerateBreakdown = async () => {
    setIsLoading(true);
    setLoadingText(undefined);
    try {
      const segments = await geminiService.generateProductionBreakdown(state.currentScript, state.language);
      setState(prev => ({
        ...prev,
        step: AppStep.FINAL_OUTPUT,
        segments
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: "Failed to generate breakdown." }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setState(prev => ({
      step: AppStep.INPUT_IDEA,
      language: prev.language, // Keep language
      userIdea: '',
      currentScript: '',
      score: null,
      segments: [],
      error: null,
    }));
  };

  const toggleLanguage = async () => {
    if (isLoading) return;

    const newLang = state.language === 'en' ? 'zh' : 'en';
    const hasScript = !!state.currentScript;

    // Immediate UI Update
    setState(prev => ({ ...prev, language: newLang }));

    // If there is no script, we are done
    if (!hasScript) return;

    // If there IS a script, we must translate it
    setIsLoading(true);
    // Use raw string or temporary lookup because 't' is still bound to old render cycle here initially
    setLoadingText(newLang === 'zh' ? '正在翻译剧本...' : 'Translating script...');
    
    try {
      const translatedScript = await geminiService.translateScript(state.currentScript, newLang);
      
      // If we translate, we should probably reset to Review Mode to ensure everything stays in sync
      // (Analysis and Breakdown would be in the old language otherwise)
      setState(prev => ({
        ...prev,
        currentScript: translatedScript,
        step: prev.step === AppStep.INPUT_IDEA ? AppStep.INPUT_IDEA : AppStep.REVIEW_SCRIPT,
        score: null, // Invalidate score as language changed
        segments: [] // Invalidate segments as language changed
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: translations[newLang].errorTranslate }));
    } finally {
      setIsLoading(false);
      setLoadingText(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-900 text-white selection:bg-cinema-500 selection:text-white">
      {/* Navbar / Header */}
      <header className="border-b border-cinema-700 bg-cinema-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center cursor-pointer" onClick={handleRestart}>
            <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-2 flex items-center justify-center font-serif italic text-white">C</span>
            CineScript<span className="text-cinema-500">.ai</span>
          </div>
          <div className="flex items-center space-x-4">
             <button 
              onClick={toggleLanguage}
              disabled={isLoading}
              className={`px-3 py-1 text-xs font-bold rounded border border-cinema-700 transition-colors flex items-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cinema-800'}`}
            >
              <span>{state.language === 'en' ? '🇺🇸 EN' : '🇨🇳 中文'}</span>
            </button>
            <div className="text-xs text-gray-500 font-mono hidden md:block">
              GEMINI-3-PRO
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        
        {state.error && (
          <div className="w-full max-w-2xl bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 text-center animate-bounce">
            {state.error}
          </div>
        )}

        {/* Global Loading Overlay (if translating script) */}
        {isLoading && loadingText && (
          <div className="fixed inset-0 bg-cinema-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-xl font-bold text-white animate-pulse">{loadingText}</p>
          </div>
        )}

        {state.step === AppStep.INPUT_IDEA && (
          <InitialInput 
            onSubmit={handleInitialSubmit} 
            isLoading={isLoading && !loadingText} // Only show button loader if not global loader
            text={t}
          />
        )}

        {state.step === AppStep.REVIEW_SCRIPT && (
          <ScriptReview 
            script={state.currentScript}
            onUpdateScript={handleUpdateScript}
            onRefine={handleRefineScript}
            onAnalyze={handleAnalyzeScript}
            isRefining={isLoading && !loadingText && !state.score} 
            isAnalyzing={isLoading && !loadingText && !!state.score === false}
            text={t}
          />
        )}

        {state.step === AppStep.SCORE_PREVIEW && state.score && (
          <ScoreView
            score={state.score}
            onContinue={handleGenerateBreakdown}
            onBack={handleBackToEdit}
            isLoading={isLoading && !loadingText}
            text={t}
          />
        )}

        {state.step === AppStep.FINAL_OUTPUT && state.score && (
          <FinalDashboard 
            score={state.score}
            segments={state.segments}
            originalIdea={state.userIdea}
            onRestart={handleRestart}
            text={t}
          />
        )}

      </main>
    </div>
  );
};

export default App;
