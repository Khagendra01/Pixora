// Remotion Studio Configuration
// You can modify these settings to match your setup

export const REMOTION_CONFIG = {
  // Default studio URL - change this if your Remotion studio runs on a different port
  DEFAULT_STUDIO_URL: "http://localhost:3001",
  
  // Alternative ports to try if the default doesn't work
  FALLBACK_PORTS: [3002, 3000, 3003, 3004, 3005],
  
  // Environment variable override
  get STUDIO_URL() {
    return process.env.NEXT_PUBLIC_REMOTION_STUDIO_URL || this.DEFAULT_STUDIO_URL;
  }
};

// Helper function to build studio URL with project path
export function buildStudioUrl(projectPath?: string | null): string {
  const baseUrl = REMOTION_CONFIG.STUDIO_URL;
  
  if (projectPath) {
    return `${baseUrl}?project=${encodeURIComponent(projectPath)}`;
  }
  
  return baseUrl;
}
