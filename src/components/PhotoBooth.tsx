import React, { useState } from "react";
import { PhotoCapture } from "./PhotoCapture";
import { editImage, analyzeImage } from "../services/gemini";
import {
  Loader2,
  Sparkles,
  Clock,
  ScanSearch,
  Download,
  RefreshCcw,
  Camera,
} from "lucide-react";
import Markdown from "react-markdown";

type ViewState = "capture" | "dashboard" | "loading" | "result";

const TIME_PERIODS = [
  {
    id: "1920s",
    label: "1920s Speakeasy",
    prompt:
      "Put this person in a 1920s speakeasy setting, wearing 1920s attire, keeping their face intact.",
  },
  {
    id: "ancient-rome",
    label: "Ancient Rome",
    prompt:
      "Put this person in Ancient Rome, wearing a toga, keeping their face intact.",
  },
  {
    id: "medieval",
    label: "Medieval Knight",
    prompt:
      "Put this person in a medieval castle, wearing knight armor, keeping their face intact.",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk 2077",
    prompt:
      "Put this person in a futuristic cyberpunk city, wearing neon cyberpunk clothing, keeping their face intact.",
  },
  {
    id: "victorian",
    label: "Victorian Era",
    prompt:
      "Put this person in the Victorian era, wearing Victorian clothing, keeping their face intact.",
  },
  {
    id: "wild-west",
    label: "Wild West",
    prompt:
      "Put this person in the Wild West, wearing cowboy attire, keeping their face intact.",
  },
];

export function PhotoBooth() {
  const [view, setView] = useState<ViewState>("capture");
  const [originalPhoto, setOriginalPhoto] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");

  const handlePhotoCaptured = (base64: string, mimeType: string) => {
    setOriginalPhoto({ base64, mimeType });
    setView("dashboard");
  };

  const handleTimeTravel = async (prompt: string) => {
    if (!originalPhoto) return;
    setView("loading");
    setLoadingText("Traveling through time...");
    try {
      const result = await editImage(
        originalPhoto.base64,
        originalPhoto.mimeType,
        prompt,
      );
      setResultImage(result);
      setAnalysisText(null);
      setView("result");
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please try again.");
      setView("dashboard");
    }
  };

  const handleCustomEdit = async () => {
    if (!originalPhoto || !customPrompt) return;
    setView("loading");
    setLoadingText("Applying AI magic...");
    try {
      const result = await editImage(
        originalPhoto.base64,
        originalPhoto.mimeType,
        customPrompt,
      );
      setResultImage(result);
      setAnalysisText(null);
      setView("result");
    } catch (error) {
      console.error(error);
      alert("Failed to edit image. Please try again.");
      setView("dashboard");
    }
  };

  const handleAnalyze = async () => {
    if (!originalPhoto) return;
    setView("loading");
    setLoadingText("Analyzing image details...");
    try {
      const result = await analyzeImage(
        originalPhoto.base64,
        originalPhoto.mimeType,
      );
      setResultImage(null);
      setAnalysisText(result);
      setView("result");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Please try again.");
      setView("dashboard");
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement("a");
      a.href = resultImage;
      a.download = "time-travel-photo.png";
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-indigo-600" />
            Time Travel Photo Booth
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take a photo and transport yourself to different eras, edit with AI,
            or analyze the image details.
          </p>
        </header>

        {view === "capture" && (
          <PhotoCapture onPhotoCaptured={handlePhotoCaptured} />
        )}

        {view === "loading" && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-slate-800">
              {loadingText}
            </h2>
          </div>
        )}

        {view === "dashboard" && originalPhoto && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <Camera className="w-5 h-5" /> Your Photo
              </h2>
              <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video relative">
                <img
                  src={`data:${originalPhoto.mimeType};base64,${originalPhoto.base64}`}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setView("capture")}
                className="mt-4 flex items-center justify-center w-full py-2 px-4 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Retake Photo
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" /> Time Travel
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIME_PERIODS.map((period) => (
                    <button
                      key={period.id}
                      onClick={() => handleTimeTravel(period.prompt)}
                      className="p-3 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all text-center"
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" /> Custom AI
                  Edit
                </h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., Add a retro filter, make me a cartoon..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleCustomEdit()}
                  />
                  <button
                    onClick={handleCustomEdit}
                    disabled={!customPrompt.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                  <ScanSearch className="w-5 h-5 text-emerald-600" /> Analyze
                  Image
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Use Gemini 3.1 Pro to analyze and describe your photo in
                  detail.
                </p>
                <button
                  onClick={handleAnalyze}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ScanSearch className="w-5 h-5" /> Analyze Now
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-3xl mx-auto">
            {resultImage && (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video relative">
                  <img
                    src={resultImage}
                    alt="Generated Result"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Download Image
                  </button>
                  <button
                    onClick={() => setView("dashboard")}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {analysisText && (
              <div className="space-y-6">
                <div className="prose prose-slate max-w-none">
                  <div className="markdown-body">
                    <Markdown>{analysisText}</Markdown>
                  </div>
                </div>
                <div className="flex justify-center pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setView("dashboard")}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
