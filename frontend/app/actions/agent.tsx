"use server";

import { spawn } from "node:child_process";
import { logExecution } from "./codexLogger";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export type CommandResult = {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
};

export type ParallelCommandResult = {
  npmInstall: CommandResult;
  codex: CommandResult;
  devServer?: CommandResult;
};

// Global variable to track the last session that used port 3001
let lastPort3001Session: string | null = null;

// Function to kill any process running on port 3001 (only for different sessions)
async function killProcessOnPort3001(currentSessionId: string): Promise<void> {
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
async function ensureNoExistingDevServer(projectPath: string): Promise<void> {
  try {
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

// Function to start Remotion dev server in background and save PID
async function startRemotionDevServer(projectPath: string, sessionId: string): Promise<{ pid: number; port: number }> {
  console.log(`🔧 startRemotionDevServer called with:`);
  console.log(`   📁 Project path: ${projectPath}`);
  console.log(`   🆔 Session ID: ${sessionId}`);
  
  return new Promise((resolve, reject) => {
    console.log("🚀 Spawning npm run dev process...");
    
    const child = spawn("npm", ["run", "dev"], {
      cwd: projectPath,
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'development',
      },
      stdio: "pipe",
      shell: true,
    });

    console.log(`🆔 Process spawned with PID: ${child.pid}`);
    
    let output = "";
    let port = 3001; // Default port - matches remotion.config.js
    
    child.stdout.on("data", (data) => {
      const dataStr = data.toString();
      output += dataStr;
      console.log(`📤 Dev server stdout: ${dataStr.trim()}`);
      
      // Look for various server ready messages
      const serverReadyPatterns = [
        /Server ready - Local: http:\/\/localhost:(\d+)/,
        /Local: http:\/\/localhost:(\d+)/,
        /listening on port (\d+)/,
        /started on port (\d+)/,
        /Server running on port (\d+)/,
        /Ready on http:\/\/localhost:(\d+)/,
        /Development server running on port (\d+)/
      ];
      
      let serverReady = false;
      let detectedPort = port;
      
      for (const pattern of serverReadyPatterns) {
        const match = output.match(pattern);
        if (match) {
          detectedPort = parseInt(match[1]);
          serverReady = true;
          console.log(`🎉 Server ready message detected with pattern: ${pattern}`);
          console.log(`🌐 Port detected: ${detectedPort}`);
          break;
        }
      }
      
      // Also check for common success indicators
      if (!serverReady) {
        const successIndicators = [
          "Server ready",
          "Local:",
          "listening on",
          "started on",
          "Server running",
          "Ready on",
          "Development server"
        ];
        
        for (const indicator of successIndicators) {
          if (output.toLowerCase().includes(indicator.toLowerCase())) {
            serverReady = true;
            console.log(`🎉 Server ready indicator detected: "${indicator}"`);
            break;
          }
        }
      }
      
      if (serverReady) {
        // Save PID to file for later cleanup
        const pidFile = path.join(projectPath, "remotion-dev-server.pid");
        console.log(`💾 Saving PID to: ${pidFile}`);
        writeFile(pidFile, child.pid?.toString() || "unknown")
          .then(() => console.log(`✅ Dev server PID saved to ${pidFile}`))
          .catch((err) => console.error(`❌ Failed to save PID: ${err}`));
        
        console.log(`✅ Resolving with PID: ${child.pid}, Port: ${detectedPort}`);
        resolve({ pid: child.pid || 0, port: detectedPort });
      }
    });

    child.stderr.on("data", (data) => {
      const dataStr = data.toString();
      console.error(`📤 Dev server stderr: ${dataStr.trim()}`);
    });

    child.on("error", (error) => {
      console.error(`❌ Process error: ${error.message}`);
      reject(new Error(`Failed to start Remotion dev server: ${error.message}`));
    });

    child.on("exit", (code, signal) => {
      console.log(`🚪 Process exited with code: ${code}, signal: ${signal}`);
    });

    // Timeout after 60 seconds (increased from 30)
    setTimeout(() => {
      console.log("⏰ Timeout reached after 60 seconds");
      console.log(`📝 Output so far: ${output.substring(0, 500)}...`);
      
      // Check if we have any indication the server might be running
      const hasServerIndicators = output.toLowerCase().includes("server") || 
                                  output.toLowerCase().includes("listening") ||
                                  output.toLowerCase().includes("port") ||
                                  output.toLowerCase().includes("ready");
      
      if (hasServerIndicators) {
        console.log("🤔 Server indicators found, assuming server is running...");
        const pidFile = path.join(projectPath, "remotion-dev-server.pid");
        writeFile(pidFile, child.pid?.toString() || "unknown")
          .then(() => console.log(`✅ Dev server PID saved to ${pidFile}`))
          .catch((err) => console.error(`❌ Failed to save PID: ${err}`));
        
        resolve({ pid: child.pid || 0, port: 3001 }); // Default port - matches remotion.config.js
      } else {
        console.log("❌ No server indicators found, killing process...");
        child.kill();
        reject(new Error("Remotion dev server failed to start within 60 seconds"));
      }
    }, 60000);
  });
}

// Function to kill the Remotion dev server
export async function killRemotionDevServer(projectPath: string): Promise<boolean> {
  try {
    const pidFile = path.join(projectPath, "remotion-dev-server.pid");
    const pidData = await import("node:fs/promises").then(fs => fs.readFile(pidFile, "utf-8"));
    const pid = parseInt(pidData.trim());
    
    if (isNaN(pid)) {
      console.log("No valid PID found in file");
      return false;
    }
    
    // Kill the process
    process.kill(pid, "SIGTERM");
    console.log(`Killed Remotion dev server with PID ${pid}`);
    
    // Remove the PID file
    await import("node:fs/promises").then(fs => fs.unlink(pidFile));
    return true;
  } catch (error) {
    console.error("Failed to kill Remotion dev server:", error);
    return false;
  }
}

function runCommand(
  command: string,
  args: string[],
  options: { cwd: string },
  timeoutMs: number = 300000, // 5 minutes default timeout
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: {
        ...process.env,
        // Ensure proper permissions for subprocess
        NODE_ENV: process.env.NODE_ENV || 'development',
      },
      stdio: "pipe",
      // Add shell option for better permission handling
      shell: true,
    });

    let stdout = "";
    let stderr = "";
    let isResolved = false;

    // Set up timeout
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        child.kill('SIGTERM');
        reject(new Error(`Command timed out after ${timeoutMs}ms: ${command} ${args.join(" ")}`));
      }
    }, timeoutMs);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", (error) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
        console.error(`Command failed: ${command} ${args.join(" ")}`, error);
        reject(error);
      }
    });

    child.on("close", (code) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
        resolve({
          command: `${command} ${args.join(" ")}`.trim(),
          exitCode: code ?? -1,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        });
      }
    });
  });
}

export async function main({
  cwd,
  message,
  sessionId,
}: {
  cwd: string;
  message: string;
  sessionId?: string;
}): Promise<ParallelCommandResult> {
  const trimmedMessage = message.trim();
  const currentSessionId = sessionId || `session-${Date.now()}`;

  if (!trimmedMessage) {
    const errorResult = {
      npmInstall: {
        command: "npm install",
        exitCode: -1,
        stdout: "",
        stderr: "No message provided for codex command.",
      },
      codex: {
        command: "codex",
        exitCode: -1,
        stdout: "",
        stderr: "No message provided for codex command.",
      },
    };

    // Log the error
    await logExecution(currentSessionId, {
      projectPath: cwd,
      message: trimmedMessage,
      command: "codex exec",
      exitCode: -1,
      stdout: "",
      stderr: "No message provided for codex command.",
      duration: 0,
      success: false,
    });

    return errorResult;
  }

  const startTime = Date.now();
  const enhancedMessage = `${trimmedMessage}

IMPORTANT: When creating the Remotion composition, always use the ID "GeneratedVideo" for the main story composition. This ensures predictable routing. Example:

<Composition
  id="GeneratedVideo"
  component={YourStoryComponent}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
/>`;
  
  const codexCommandString = `exec --dangerously-bypass-approvals-and-sandbox --sandbox=workspace-write "${enhancedMessage}"`;

  try {
    // Run npm install and codex command in parallel
    const [npmInstallResult, codexResult] = await Promise.all([
      runCommand("npm", ["install"], { cwd }, 120000), // 2 minutes for npm install
      runCommand("codex", [codexCommandString], { cwd }, 600000), // 10 minutes for codex
    ]);

    const duration = Date.now() - startTime;
    const success = codexResult.exitCode === 0;

    // Log the execution FIRST
    await logExecution(currentSessionId, {
      projectPath: cwd,
      message: trimmedMessage,
      command: `codex ${codexCommandString}`,
      exitCode: codexResult.exitCode,
      stdout: codexResult.stdout,
      stderr: codexResult.stderr,
      duration,
      success,
    });

    // AFTER logging, start the Remotion dev server if codex was successful
    let devServerResult = null;
    if (success) {
      try {
        console.log("🎬 CODEX SUCCESS: Starting Remotion dev server in background...");
        console.log(`📁 Project path: ${cwd}`);
        console.log(`🆔 Session ID: ${currentSessionId}`);
        
        // Kill any existing dev server first
        console.log("🧹 Cleaning up any existing dev servers...");
        await ensureNoExistingDevServer(cwd);
        
        // Also kill any process on port 3001 (only for different sessions)
        console.log("🧹 Cleaning up port 3001...");
        await killProcessOnPort3001(currentSessionId);
        
        console.log("✅ Cleanup completed");
        
        // Start dev server in background without waiting for it to complete
        console.log("🚀 Launching npm run dev in background...");
        startRemotionDevServer(cwd, currentSessionId).then(({ pid, port }) => {
          console.log(`✅ Remotion dev server started successfully!`);
          console.log(`🌐 Port: ${port}`);
          console.log(`🆔 PID: ${pid}`);
          console.log(`🔗 URL: http://localhost:${port}`);
        }).catch((devError) => {
          console.error("❌ Failed to start Remotion dev server:", devError);
          console.error("🔍 Error details:", devError instanceof Error ? devError.message : String(devError));
        });
        
        console.log("📝 Dev server startup initiated (non-blocking)");
        
        devServerResult = {
          command: "npm run dev",
          exitCode: 0,
          stdout: "Dev server starting in background...",
          stderr: "",
        };
      } catch (devError) {
        console.error("❌ CRITICAL: Failed to start Remotion dev server:", devError);
        console.error("🔍 Error details:", devError instanceof Error ? devError.message : String(devError));
        // Don't fail the whole operation if dev server fails to start
        devServerResult = {
          command: "npm run dev",
          exitCode: -1,
          stdout: "",
          stderr: devError instanceof Error ? devError.message : String(devError),
        };
      }
    } else {
      console.log("❌ CODEX FAILED: Skipping dev server startup");
    }

    return {
      npmInstall: npmInstallResult,
      codex: codexResult,
      devServer: devServerResult || undefined,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Log the error
    await logExecution(currentSessionId, {
      projectPath: cwd,
      message: trimmedMessage,
      command: `codex ${codexCommandString}`,
      exitCode: -1,
      stdout: "",
      stderr: errorMessage,
      duration,
      success: false,
    });

    throw error;
  }
}
