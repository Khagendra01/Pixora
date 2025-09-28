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
      {/* Minimized project path indicator */}
      {projectPath && (
        <div className="absolute top-1 left-1 z-10 rounded bg-black/90 px-1 py-0.5 text-[8px] text-white/60 max-w-[120px] truncate">
          {projectPath.split('/').pop()}
        </div>
      )}
      
      {/* Minimized connection status indicator */}
      <div className="absolute top-1 right-1 z-10 rounded bg-black/90 px-1 py-0.5 text-[8px]">
        <div className={`flex items-center gap-0.5 ${isAvailable ? 'text-green-400' : 'text-yellow-400'}`}>
          <div className={`w-1 h-1 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-yellow-400'}`} />
          {isAvailable ? 'ON' : '...'}
        </div>
      </div>
      
      {/* Extra large Remotion Studio Embed - only show if available */}
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
            /* Make Remotion studio controls smaller to maximize video area */
            .remotion-preview-container iframe {
              transform: scale(1);
            }
            /* Minimize overlay gradient */
            .remotion-preview-container::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 15px;
              background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
              pointer-events: none;
              z-index: 10;
            }
          `}</style>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="text-center text-white/80">
            <div className="text-4xl mb-2">🎬</div>
            <div className="text-lg font-medium">
              {projectPath ? 'Your Project Preview' : 'Remotion Preview'}
            </div>
            <div className="text-sm text-white/60 mt-1">
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
