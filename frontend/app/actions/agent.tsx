"use server";

import { logExecution } from "./codexLogger";
import { runCommand, type CommandResult, type ParallelCommandResult } from "../../lib/utils/commandUtils";
import { killProcessOnPort3001, ensureNoExistingDevServer } from "../../lib/utils/processUtils";
import { startRemotionDevServer, startRemotionDevServerNonBlocking, killRemotionDevServer } from "../../lib/utils/remotionUtils";

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
  const enhancedMessage = `STORY ANALYSIS & VIDEO GENERATION

USER REQUEST: "${trimmedMessage}"

CRITICAL INSTRUCTIONS:
1. ANALYZE the user's story request carefully - identify the main character(s), setting, conflict/action, and emotional tone
2. CREATE a cohesive narrative that follows a clear story arc (setup → conflict → resolution)
3. USE PARALLEL GENERATION for all assets - DO NOT create individual files
4. COORDINATE with shared context for schema consistency
5. FOCUS on story coherence and emotional impact

PARALLEL GENERATION REQUIREMENTS:
- Use: bash tools/force-parallel-assets.sh (handles all asset generation in parallel)
- DO NOT create individual SVG files manually
- DO NOT use sequential asset generation
- Let parallel generators handle: Main files, SVG assets, Audio assets

STORY REQUIREMENTS:
- Extract the core story elements from the user's request
- Identify the emotional journey (what feeling should viewers have?)
- Determine the visual style that matches the story tone
- Plan the 3-act structure: Setup (0-300 frames), Conflict (300-600 frames), Resolution (600-900 frames)

TECHNICAL REQUIREMENTS:
- Use composition ID "GeneratedVideo" for the main story composition
- Duration: 900 frames (30 seconds at 30fps)
- Resolution: 1920x1080
- Include proper imports and component structure

FOCUS ON: Story coherence, emotional impact, and visual storytelling over technical complexity.`;
  
  const codexArgs = [
    "exec",
    "--dangerously-bypass-approvals-and-sandbox",
    "--sandbox=workspace-write",
    "--json",
    enhancedMessage
  ];

  try {
    // Start cleanup and dev server preparation in parallel with codex
    console.log("🧹 Starting cleanup and dev server preparation in parallel with codex...");
    
    // Start cleanup processes in parallel
    const cleanupPromise = Promise.all([
      ensureNoExistingDevServer(cwd),
      killProcessOnPort3001(currentSessionId)
    ]);

    // Run npm install, codex command, and cleanup in parallel
    const [npmInstallResult, codexResult] = await Promise.all([
      runCommand("npm", ["install"], { cwd }, 120000), // 2 minutes for npm install
      runCommand("codex", codexArgs, { cwd }, 600000), // 10 minutes for codex
    ]);

    const duration = Date.now() - startTime;
    const success = codexResult.exitCode === 0;

    // Log the execution FIRST
    await logExecution(currentSessionId, {
      projectPath: cwd,
      message: trimmedMessage,
      command: `codex ${codexArgs.join(" ")}`,
      exitCode: codexResult.exitCode,
      stdout: codexResult.stdout,
      stderr: codexResult.stderr,
      duration,
      success,
    });

    // Start dev server in background if codex was successful (non-blocking)
    let devServerResult = null;
    if (success) {
      try {
        console.log("🎬 CODEX SUCCESS: Starting Remotion dev server in background...");
        console.log(`📁 Project path: ${cwd}`);
        console.log(`🆔 Session ID: ${currentSessionId}`);
        
        // Wait for cleanup to complete
        console.log("🧹 Waiting for cleanup to complete...");
        await cleanupPromise;
        console.log("✅ Cleanup completed");
        
        // Start dev server in background without waiting for it to complete
        console.log("🚀 Launching npm run dev in background (non-blocking)...");
        startRemotionDevServerNonBlocking(cwd, currentSessionId).then(({ pid, port }: { pid: number; port: number }) => {
          console.log(`✅ Remotion dev server process started!`);
          console.log(`🌐 Port: ${port}`);
          console.log(`🆔 PID: ${pid}`);
          console.log(`🔗 URL: http://localhost:${port}`);
          console.log(`📝 Server is starting up in background...`);
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
      command: `codex ${codexArgs.join(" ")}`,
      exitCode: -1,
      stdout: "",
      stderr: errorMessage,
      duration,
      success: false,
    });

    throw error;
  }
}
