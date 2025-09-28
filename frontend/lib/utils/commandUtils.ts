import { spawn } from "node:child_process";

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

export function runCommand(
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
