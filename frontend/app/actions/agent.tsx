"use server";

import { logExecution } from "./codexLogger";
import { runCommand, type CommandResult, type ParallelCommandResult } from "../../lib/utils/commandUtils";
import { killProcessOnPort3001, ensureNoExistingDevServer } from "../../lib/utils/processUtils";
import { startRemotionDevServer, killRemotionDevServer } from "../../lib/utils/remotionUtils";

// Re-export for backward compatibility
export { killRemotionDevServer };

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
        startRemotionDevServer(cwd, currentSessionId).then(({ pid, port }: { pid: number; port: number }) => {
          console.log(`✅ Remotion dev server started successfully!`);
          console.log(`🌐 Port: ${port}`);
          console.log(`🆔 PID: ${pid}`);
          console.log(`🔗 URL: http://localhost:${port}`);
        }).catch((devError: unknown) => {
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
