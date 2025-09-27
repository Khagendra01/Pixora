"use server";
import { spawn } from "node:child_process";

function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: process.env,
      stdio: "pipe",
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    child.on("error", (error) => {
      reject(error);
    });
    child.on("close", (code) => {
      resolve({
        command: `${command} ${args.join(" ")}`.trim(),
        exitCode: code !== null && code !== void 0 ? code : -1,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    });
  });
}
export async function main({ cwd, message }) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    return {
      command: "codex",
      exitCode: -1,
      stdout: "",
      stderr: "No message provided for codex command.",
    };
  }
  return runCommand("codex", [trimmedMessage], { cwd });
}
