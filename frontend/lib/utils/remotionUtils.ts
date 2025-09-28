import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Function to start Remotion dev server in background without waiting for it to be ready
export async function startRemotionDevServerNonBlocking(projectPath: string, sessionId: string): Promise<{ pid: number; port: number }> {
  console.log(`🔧 startRemotionDevServerNonBlocking called with:`);
  console.log(`   📁 Project path: ${projectPath}`);
  console.log(`   🆔 Session ID: ${sessionId}`);
  
  return new Promise((resolve, reject) => {
    console.log("🚀 Spawning npm run dev process (non-blocking)...");
    
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
    
    // Save PID immediately and resolve without waiting for server to be ready
    const pidFile = path.join(projectPath, "remotion-dev-server.pid");
    console.log(`💾 Saving PID to: ${pidFile}`);
    writeFile(pidFile, child.pid?.toString() || "unknown")
      .then(() => console.log(`✅ Dev server PID saved to ${pidFile}`))
      .catch((err) => console.error(`❌ Failed to save PID: ${err}`));
    
    // Resolve immediately with PID and default port
    console.log(`✅ Resolving immediately with PID: ${child.pid}, Port: 3001 (default)`);
    resolve({ pid: child.pid || 0, port: 3001 });

    // Set up logging for when server actually starts
    let output = "";
    child.stdout.on("data", (data) => {
      const dataStr = data.toString();
      output += dataStr;
      console.log(`📤 Dev server stdout: ${dataStr.trim()}`);
      
      // Look for server ready messages and log them
      const serverReadyPatterns = [
        /Server ready - Local: http:\/\/localhost:(\d+)/,
        /Local: http:\/\/localhost:(\d+)/,
        /listening on port (\d+)/,
        /started on port (\d+)/,
        /Server running on port (\d+)/,
        /Ready on http:\/\/localhost:(\d+)/,
        /Development server running on port (\d+)/
      ];
      
      for (const pattern of serverReadyPatterns) {
        const match = output.match(pattern);
        if (match) {
          const detectedPort = parseInt(match[1]);
          console.log(`🎉 Server ready message detected!`);
          console.log(`🌐 Actual port: ${detectedPort}`);
          break;
        }
      }
    });

    child.stderr.on("data", (data) => {
      const dataStr = data.toString();
      console.error(`📤 Dev server stderr: ${dataStr.trim()}`);
    });

    child.on("error", (error) => {
      console.error(`❌ Process error: ${error.message}`);
    });

    child.on("exit", (code, signal) => {
      console.log(`🚪 Process exited with code: ${code}, signal: ${signal}`);
    });
  });
}

// Function to start Remotion dev server in background and save PID
export async function startRemotionDevServer(projectPath: string, sessionId: string): Promise<{ pid: number; port: number }> {
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
