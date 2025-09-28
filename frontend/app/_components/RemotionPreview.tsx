"use client";

import { useEffect, useState } from "react";
import { REMOTION_CONFIG, buildStudioUrl } from "@/lib/remotionConfig";
import { checkRemotionServer } from "@/app/actions/remotionServer";

interface RemotionPreviewProps {
  projectPath?: string | null;
}

export function RemotionPreview({ projectPath }: RemotionPreviewProps) {
  const [studioUrl, setStudioUrl] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Try to detect the Remotion studio URL dynamically
    const detectStudioUrl = async () => {
      // Try the configured URL first
      const configuredUrl = REMOTION_CONFIG.STUDIO_URL;
      const configuredPort = parseInt(configuredUrl.split(':')[2] || '3001');
      
      try {
        const serverStatus = await checkRemotionServer(configuredPort);
        if (serverStatus.isRunning) {
          setStudioUrl(serverStatus.url);
          setIsConnected(true);
          return;
        }
      } catch (error) {
        console.log("Configured port not available, trying fallbacks...");
      }
      
      // Try fallback ports
      for (const port of REMOTION_CONFIG.FALLBACK_PORTS) {
        try {
          const serverStatus = await checkRemotionServer(port);
          if (serverStatus.isRunning) {
            setStudioUrl(serverStatus.url);
            setIsConnected(true);
            return;
          }
        } catch (error) {
          continue;
        }
      }
      
      // Fallback to configured URL even if not reachable
      setStudioUrl(configuredUrl);
      setIsConnected(false);
    };

    detectStudioUrl();
    
    // Check server status every 5 seconds
    const interval = setInterval(detectStudioUrl, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/60 relative">
      {projectPath && (
        <div className="absolute top-2 left-2 z-10 rounded-lg bg-black/80 px-2 py-1 text-xs text-white/80">
          Project: {projectPath.split('/').pop()}
        </div>
      )}
      
      {/* Connection status indicator */}
      <div className="absolute top-2 right-2 z-10 rounded-lg bg-black/80 px-2 py-1 text-xs">
        <div className={`flex items-center gap-1 ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
          {isConnected ? 'Connected' : 'Studio Offline'}
        </div>
      </div>
      
      {/* Remotion Studio Embed */}
      {isConnected && studioUrl ? (
        <iframe
          src={studioUrl}
          className="h-full w-full border-0"
          title="Remotion Studio"
          allow="camera; microphone; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="text-center text-white/80">
            <div className="text-2xl mb-2">🎬</div>
            <div className="text-sm font-medium">
              {projectPath ? 'Your Project Preview' : 'Remotion Preview'}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {projectPath ? `Loading: ${projectPath.split('/').pop()}` : 'Ready to preview'}
            </div>
            {studioUrl && (
              <div className="text-xs text-white/40 mt-2">
                Studio: {studioUrl}
              </div>
            )}
            {!isConnected && (
              <div className="text-xs text-yellow-400 mt-2">
                Connecting to Remotion Studio...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
