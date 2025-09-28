"use server";

import { spawn } from "node:child_process";
import path from "node:path";

export type ServerStatus = {
  isRunning: boolean;
  port: number;
  url: string;
  pid?: number;
};

export async function startRemotionServer(projectPath: string): Promise<ServerStatus> {
  const fullPath = path.resolve(process.cwd(), projectPath);
  
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "dev"], {
      cwd: fullPath,
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'development',
      },
      stdio: "pipe",
      shell: true,
    });

    let output = "";
    
    child.stdout.on("data", (data) => {
      output += data.toString();
      
      // Look for the server ready message
      if (output.includes("Server ready - Local:")) {
        const match = output.match(/Server ready - Local: http:\/\/localhost:(\d+)/);
        if (match) {
          const port = parseInt(match[1]);
          resolve({
            isRunning: true,
            port,
            url: `http://localhost:${port}`,
            pid: child.pid,
          });
        }
      }
    });

    child.stderr.on("data", (data) => {
      console.error("Remotion server error:", data.toString());
    });

    child.on("error", (error) => {
      reject(new Error(`Failed to start Remotion server: ${error.message}`));
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!output.includes("Server ready")) {
        child.kill();
        reject(new Error("Remotion server failed to start within 30 seconds"));
      }
    }, 30000);
  });
}

export async function checkRemotionServer(port: number = 3001): Promise<ServerStatus> {
  try {
    const response = await fetch(`http://localhost:${port}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    
    return {
      isRunning: response.ok,
      port,
      url: `http://localhost:${port}`,
    };
  } catch (error) {
    return {
      isRunning: false,
      port,
      url: `http://localhost:${port}`,
    };
  }
}
