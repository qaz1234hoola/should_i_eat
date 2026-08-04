'use client';

import { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, Info, Sparkles, Loader2, HeartPulse } from 'lucide-react';

export default function IngredientAnalyzer() {
  // 1. STATE MANAGEMENT
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loadingStep1, setLoadingStep1] = useState(false);
  const [step1Data, setStep1Data] = useState(null);

  const [userCondition, setUserCondition] = useState('');
  const [loadingStep2, setLoadingStep2] = useState(false);
  const [step2Data, setStep2Data] = useState(null);

  // 2. HANDLE IMAGE SELECTION
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      // Reset state if a new image is picked
      setStep1Data(null);
      setStep2Data(null);
      setUserCondition('');
    }
  };

// 3. STEP 1: UPLOAD IMAGE TO BACKEND
  const handleAnalyzeIngredients = async () => {
    if (!file) return;
    setLoadingStep1(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze-ingredients', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Check if API returned an error status or error payload
      if (!response.ok || data.error) {
        alert(data.error || 'Failed to analyze label image. Check your GROQ_API_KEY in .env.local.');
        return;
      }

      setStep1Data(data);
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setLoadingStep1(false);
    }
  };

  // 4. STEP 2: SEND TYPED CONDITION TO BACKEND
  const handleConditionSubmit = async (e) => {
    e.preventDefault();
    if (!userCondition.trim() || !step1Data) return;

    setLoadingStep2(true);
    const ingredientNames = step1Data.ingredients.map((item) => item.name);

    try {
      const response = await fetch('/api/analyze-condition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredientNames,
          user_condition: userCondition,
        }),
      });
      const data = await response.json();
      setStep2Data(data);
    } catch (error) {
      console.error('Error checking health condition:', error);
      alert('Failed to evaluate health condition.');
    } finally {
      setLoadingStep2(false);
    }
  };

  // Helper for Rating Colors
  const getRatingBadge = (rating) => {
    const lower = rating?.toLowerCase() || '';
    if (lower.includes('green')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (lower.includes('yellow')) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" /> AI Food Intelligence
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Ingredient Label Analyser
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Upload a label photo to get plain-English breakdowns, pros & cons, and personalized health condition warnings.
          </p>
        </header>

        {/* SECTION 1: UPLOAD & PREVIEW */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            
            {/* Upload Dropzone */}
            <label className="flex flex-col items-center justify-center w-full md:w-1/2 h-52 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-medium text-slate-700">Click to upload label photo</span>
              <span className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {/* Preview Box */}
            <div className="w-full md:w-1/2 h-52 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Label Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-sm text-slate-400">Image preview will appear here</span>
              )}
            </div>
          </div>

          {/* Analyze Button */}
          {file && !step1Data && (
            <button
              onClick={handleAnalyzeIngredients}
              disabled={loadingStep1}
              className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loadingStep1 ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting & Analysing Ingredients...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyse Ingredients
                </>
              )}
            </button>
          )}
        </section>

        {/* SECTION 2: STEP 1 RESULTS (GENERAL BREAKDOWN) */}
        {step1Data && step1Data.verdict && (
          <section className="space-y-6">
            
            {/* General Verdict Banner */}
            <div className={`p-6 rounded-2xl border ${getRatingBadge(step1Data.verdict?.overall_rating)} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/60">
                  Overall Quality: {step1Data.verdict?.overall_rating}
                </span>
                <span className="text-xs text-slate-500 font-medium">{step1Data.product_category}</span>
              </div>
              <h2 className="text-xl font-bold">{step1Data.verdict?.headline}</h2>
              <p className="text-sm leading-relaxed">{step1Data.verdict?.summary}</p>
            </div>

            {/* Ingredient Breakdown List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Ingredient Breakdown</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {(step1Data.ingredients || []).map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">
                        {item.is_ok_in_this_product}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      <strong>What it is:</strong> {item.what_it_is}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
                      {/* Pros */}
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <span className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Pros
                        </span>
                        <ul className="list-disc list-inside text-emerald-800 text-xs space-y-1">
                          {(item.pros || []).map((pro, idx) => <li key={idx}>{pro}</li>)}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                        <span className="font-semibold text-rose-900 flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-4 h-4 text-rose-600" /> Cons
                        </span>
                        <ul className="list-disc list-inside text-rose-800 text-xs space-y-1">
                          {(item.cons || []).map((con, idx) => <li key={idx}>{con}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span><strong>Safe limit:</strong> {item.safe_consumption_limit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: STEP 2 HEALTH CONDITION PROMPT */}
            <div className="bg-indigo-900 text-white p-6 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-indigo-300" />
                <h3 className="text-xl font-bold">Check for Specific Health Conditions</h3>
              </div>
              <p className="text-indigo-200 text-sm">
                Have a specific health goal or condition? Type it below (e.g., <em>"PCOS"</em>, <em>"Thyroid & GERD"</em>, <em>"High BP"</em>) to see if this product is safe for you.
              </p>

              <form onSubmit={handleConditionSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="text"
                  value={userCondition}
                  onChange={(e) => setUserCondition(e.target.value)}
                  placeholder="Type condition (e.g., PCOS, Thyroid, Diabetes, High Cholesterol)..."
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-950/60 border border-indigo-700 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  disabled={loadingStep2 || !userCondition.trim()}
                  className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingStep2 ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Safety'}
                </button>
              </form>
            </div>

            {/* SECTION 4: STEP 2 RESULT (TAILORED VERDICT) */}
            {step2Data && (
              <div className="bg-white p-6 rounded-2xl border-2 border-indigo-500 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900">
                    Health Analysis for: <span className="text-indigo-600">{step2Data.user_condition}</span>
                  </h4>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 font-bold text-sm rounded-full">
                    {step2Data.recommendation}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {step2Data.explanation}
                </p>

                {step2Data.flagged_ingredients?.length > 0 && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="text-xs font-bold text-amber-900 block mb-1">
                      ⚠️ Flagged Ingredients for your condition:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {step2Data.flagged_ingredients.map((ing, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-amber-200 text-amber-900 text-xs font-medium rounded-md">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
                  <strong>Actionable Advice:</strong> {step2Data.actionable_advice}
                </div>
              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}