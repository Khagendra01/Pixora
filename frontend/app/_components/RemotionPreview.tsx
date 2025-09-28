"use client";

import { useEffect, useState } from "react";

interface RemotionPreviewProps {
  projectPath?: string | null;
}

export function RemotionPreview({ projectPath }: RemotionPreviewProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const targetUrl = "http://localhost:3001/GeneratedVideo";

  useEffect(() => {
    const checkUrlAvailability = async () => {
      setIsChecking(true);
      try {
        const response = await fetch(targetUrl, { 
          method: 'HEAD',
          mode: 'no-cors' // This allows us to check if the server responds without CORS issues
        });
        setIsAvailable(true);
      } catch (error) {
        // Try a different approach - check if we can reach the base URL
        try {
          const baseResponse = await fetch("http://localhost:3001", { 
            method: 'HEAD',
            mode: 'no-cors'
          });
          setIsAvailable(true);
        } catch (baseError) {
          setIsAvailable(false);
        }
      }
      setIsChecking(false);
    };

    checkUrlAvailability();
    
    // Check every 3 seconds
    const interval = setInterval(checkUrlAvailability, 3000);
    return () => clearInterval(interval);
  }, []);

  // Don't render anything if the URL is not available
  if (!isAvailable && !isChecking) {
    return null;
  }

  return (
    <div className="aspect-video w-full h-full overflow-hidden rounded-[32px] border border-white/10 bg-black/60 relative">
      {projectPath && (
        <div className="absolute top-2 left-2 z-10 rounded-lg bg-black/80 px-2 py-1 text-xs text-white/80">
          Project: {projectPath.split('/').pop()}
        </div>
      )}
      
      {/* Connection status indicator */}
      <div className="absolute top-2 right-2 z-10 rounded-lg bg-black/80 px-2 py-1 text-xs">
        <div className={`flex items-center gap-1 ${isAvailable ? 'text-green-400' : 'text-yellow-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-yellow-400'}`} />
          {isAvailable ? 'Connected' : 'Checking...'}
        </div>
      </div>
      
      {/* Remotion Studio Embed - only show if available */}
      {isAvailable ? (
        <div className="h-full w-full relative remotion-preview-container">
          <iframe
            src={targetUrl}
            className="h-full w-full border-0"
            title="Remotion GeneratedVideo"
            allow="camera; microphone; fullscreen"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          />
          <style jsx global>{`
            .remotion-preview-container iframe {
              height: 100% !important;
              width: 100% !important;
            }
            /* Make Remotion studio controls smaller */
            .remotion-preview-container iframe {
              transform: scale(1);
            }
            /* Add custom CSS injection for Remotion studio */
            .remotion-preview-container::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 30px;
              background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
              pointer-events: none;
              z-index: 10;
            }
          `}</style>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="text-center text-white/80">
            <div className="text-2xl mb-2">🎬</div>
            <div className="text-sm font-medium">
              {projectPath ? 'Your Project Preview' : 'Remotion Preview'}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {isChecking ? 'Checking availability...' : 'GeneratedVideo not available'}
            </div>
            <div className="text-xs text-white/40 mt-2">
              URL: {targetUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
