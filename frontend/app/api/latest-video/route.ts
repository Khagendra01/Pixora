import { NextResponse } from 'next/server';
import { getAllLogs } from '../../actions/codexLogger';

export async function GET() {
  try {
    const logs = await getAllLogs();
    
    // Get the most recent successful execution
    const latestLog = logs
      .filter(log => log.success && log.exitCode === 0)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (!latestLog) {
      return NextResponse.json({ error: 'No successful video generation found' }, { status: 404 });
    }
    
    return NextResponse.json({
      sessionId: latestLog.sessionId,
      projectPath: latestLog.projectPath,
      timestamp: latestLog.timestamp,
      message: latestLog.message
    });
  } catch (error) {
    console.error('Error getting latest video:', error);
    return NextResponse.json(
      { error: 'Failed to get latest video' }, 
      { status: 500 }
    );
  }
}
