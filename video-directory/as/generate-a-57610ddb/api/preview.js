// Simple preview API that serves the video stream
// This would be implemented in your Remotion project

export default function handler(req, res) {
  const { project } = req.query;
  
  // Set headers for video streaming
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // For now, return a placeholder response
  // In a real implementation, this would stream the actual video
  res.status(200).json({ 
    message: 'Preview API endpoint - would stream video here',
    project: project || 'default'
  });
}
