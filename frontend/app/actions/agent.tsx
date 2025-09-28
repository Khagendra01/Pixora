"use server";

import { spawn } from "node:child_process";
import { logExecution } from "./codexLogger";

export type CommandResult = {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
};

export type ParallelCommandResult = {
  npmInstall: CommandResult;
  codex: CommandResult;
};

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
  const codexCommandString = `exec --dangerously-bypass-approvals-and-sandbox --sandbox=workspace-write "${trimmedMessage}"`;

  try {
    // Run npm install and codex command in parallel
    const [npmInstallResult, codexResult] = await Promise.all([
      runCommand("npm", ["install"], { cwd }, 120000), // 2 minutes for npm install
      runCommand("codex", [codexCommandString], { cwd }, 600000), // 10 minutes for codex
    ]);

    const duration = Date.now() - startTime;
    const success = codexResult.exitCode === 0;

    // Log the execution
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

    return {
      npmInstall: npmInstallResult,
      codex: codexResult,
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
