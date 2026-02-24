import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, RefreshCw } from "lucide-react";

interface PhotoCaptureProps {
  onPhotoCaptured: (base64: string, mimeType: string) => void;
}

export function PhotoCapture({ onPhotoCaptured }: PhotoCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const [prefix, base64] = imageSrc.split(",");
      const mimeType = prefix.match(/:(.*?);/)?.[1] || "image/jpeg";
      onPhotoCaptured(base64, mimeType);
    }
  }, [webcamRef, onPhotoCaptured]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const [prefix, base64] = result.split(",");
        const mimeType = prefix.match(/:(.*?);/)?.[1] || file.type;
        onPhotoCaptured(base64, mimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === "camera"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Camera className="w-5 h-5 inline-block mr-2" />
          Camera
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === "upload"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Upload className="w-5 h-5 inline-block mr-2" />
          Upload
        </button>
      </div>

      <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative">
        {mode === "camera" ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
            <button
              onClick={capture}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-full"></div>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Upload className="w-12 h-12 mb-4" />
            <p className="mb-4">Drag and drop or click to upload</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Select File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}
