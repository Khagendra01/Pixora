// Global variable to track the last session that used port 3001
let lastPort3001Session: string | null = null;

// Function to kill any process running on port 3001 (only for different sessions)
export async function killProcessOnPort3001(currentSessionId: string): Promise<void> {
  try {
    console.log(`🔍 Checking if port 3001 cleanup is needed for session: ${currentSessionId}`);
    console.log(`🔍 Last session that used port 3001: ${lastPort3001Session}`);
    
    // Only kill processes if this is a different session
    if (lastPort3001Session === currentSessionId) {
      console.log(`ℹ️ Same session as last port 3001 usage, skipping cleanup`);
      return;
    }
    
    console.log(`🔍 Different session detected, checking for processes on port 3001...`);
    
    // Use lsof to find processes on port 3001
    const { exec } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execAsync = promisify(exec);
    
    try {
      const { stdout } = await execAsync("lsof -ti:3001");
      const pids = stdout.trim().split('\n').filter(pid => pid && !isNaN(parseInt(pid)));
      
      if (pids.length > 0) {
        console.log(`🔄 Found ${pids.length} process(es) on port 3001: ${pids.join(', ')}`);
        
        for (const pid of pids) {
          try {
            console.log(`🗑️ Killing process ${pid} on port 3001...`);
            process.kill(parseInt(pid), "SIGTERM");
            console.log(`✅ Killed process ${pid}`);
          } catch (killError) {
            console.log(`⚠️ Could not kill process ${pid}: ${killError instanceof Error ? killError.message : String(killError)}`);
          }
        }
        
        // Wait a moment for processes to die
        console.log(`⏳ Waiting for processes to die...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`✅ Port 3001 cleanup completed`);
      } else {
        console.log(`ℹ️ No processes found on port 3001`);
      }
    } catch (lsofError) {
      // lsof might not be available or port might not be in use
      console.log(`ℹ️ Could not check port 3001 (${lsofError instanceof Error ? lsofError.message : 'lsof not available'})`);
    }
    
    // Update the last session that used port 3001
    lastPort3001Session = currentSessionId;
    console.log(`📝 Updated last port 3001 session to: ${currentSessionId}`);
  } catch (error) {
    console.log(`ℹ️ Port 3001 cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to check if a dev server is already running and kill it
export async function ensureNoExistingDevServer(projectPath: string): Promise<void> {
  try {
    const path = await import("node:path");
    const pidFile = path.join(projectPath, "remotion-dev-server.pid");
    console.log(`🔍 Checking for existing dev server PID file: ${pidFile}`);
    
    const pidData = await import("node:fs/promises").then(fs => fs.readFile(pidFile, "utf-8"));
    const pid = parseInt(pidData.trim());
    
    if (!isNaN(pid)) {
      console.log(`🔄 Found existing dev server with PID ${pid}, killing it...`);
      process.kill(pid, "SIGTERM");
      console.log(`🗑️ Removed PID file: ${pidFile}`);
      await import("node:fs/promises").then(fs => fs.unlink(pidFile));
      // Wait a moment for the process to die
      console.log(`⏳ Waiting for process to die...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`✅ Existing dev server cleanup completed`);
    } else {
      console.log(`ℹ️ No valid PID found in file`);
    }
  } catch (error) {
    // File doesn't exist or can't be read, that's fine
    console.log(`ℹ️ No existing dev server found (${error instanceof Error ? error.message : 'file not found'})`);
  }
}
