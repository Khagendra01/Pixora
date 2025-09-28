"use client";

import { useEffect, useState } from "react";

export default function VideoPage() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Get the latest generated video session
    const getLatestVideo = async () => {
      try {
        setIsLoading(true);
        
        // Get the latest session ID from the logs
        const response = await fetch('/api/latest-video');
        if (!response.ok) {
          throw new Error('Failed to get latest video');
        }
        
        const data = await response.json();
        if (data.sessionId) {
          // Construct the Remotion preview URL for the GeneratedVideo composition
          const remotionUrl = `http://localhost:3001?composition=GeneratedVideo&projectPath=${encodeURIComponent(data.projectPath)}`;
          setVideoUrl(remotionUrl);
        } else {
          setError('No video found. Please generate a video first.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    getLatestVideo();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-500 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Generated Video</h1>
            <p className="text-blue-100">Your AI-generated story video</p>
          </div>
          
          <div className="p-6">
            {videoUrl ? (
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  title="Generated Video"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Video not available</p>
              </div>
            )}
            
            <div className="mt-6 flex gap-4">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Open in New Tab
              </a>
              <a
                href="/"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Generate New Video
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
