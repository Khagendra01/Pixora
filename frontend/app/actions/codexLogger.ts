"use server";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface CodexLogEntry {
  timestamp: string;
  sessionId: string;
  projectPath: string;
  message: string;
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
  success: boolean;
}

// Helper function to get logs directory
function getLogsDirectory(): string {
  // When running from frontend directory, go up one level to Pixora, then to video-directory/logs
  return path.resolve(process.cwd(), "..", "video-directory", "logs");
}

// Helper function to ensure logs directory exists
async function ensureLogsDirectory(): Promise<void> {
  try {
    const logsDir = getLogsDirectory();
    console.log("Creating logs directory at:", logsDir);
    await mkdir(logsDir, { recursive: true });
    console.log("Logs directory created successfully");
  } catch (error) {
    console.error("Failed to create logs directory:", error);
  }
}

// Helper function to append to file
async function appendToFile(filePath: string, entry: CodexLogEntry): Promise<void> {
  try {
    const logLine = JSON.stringify(entry) + "\n";
    await writeFile(filePath, logLine, { flag: "a" });
  } catch (error) {
    console.error("Failed to write log file:", error);
  }
}

// Helper function to append human readable log
async function appendHumanReadableLog(filePath: string, entry: CodexLogEntry): Promise<void> {
  try {
    const humanLog = `
=== CODEX EXECUTION LOG ===
Session ID: ${entry.sessionId}
Timestamp: ${entry.timestamp}
Project Path: ${entry.projectPath}
Message: ${entry.message}
Command: ${entry.command}
Exit Code: ${entry.exitCode}
Duration: ${entry.duration}ms
Success: ${entry.success ? "YES" : "NO"}

--- STDOUT ---
${entry.stdout}

--- STDERR ---
${entry.stderr}

================================

`;
    await writeFile(filePath, humanLog, { flag: "a" });
  } catch (error) {
    console.error("Failed to write human-readable log:", error);
  }
}

// Main logging function
export async function logExecution(
  sessionId: string,
  entry: Omit<CodexLogEntry, "timestamp" | "sessionId">
): Promise<void> {
  console.log("Logging execution for session:", sessionId);
  await ensureLogsDirectory();
  
  const logEntry: CodexLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    sessionId,
  };

  const logsDir = getLogsDirectory();
  console.log("Logs directory:", logsDir);

  // Save individual session log
  const sessionLogFile = path.join(logsDir, `${sessionId}.json`);
  console.log("Saving session log to:", sessionLogFile);
  await appendToFile(sessionLogFile, logEntry);

  // Save to master log
  const masterLogFile = path.join(logsDir, "master.json");
  console.log("Saving master log to:", masterLogFile);
  await appendToFile(masterLogFile, logEntry);

  // Save human-readable log
  const humanLogFile = path.join(logsDir, `${sessionId}.txt`);
  console.log("Saving human log to:", humanLogFile);
  await appendHumanReadableLog(humanLogFile, logEntry);
  
  console.log("Logging completed for session:", sessionId);
}

// Get session logs
export async function getSessionLogs(sessionId: string): Promise<CodexLogEntry[]> {
  try {
    const logsDir = getLogsDirectory();
    const logFile = path.join(logsDir, `${sessionId}.json`);
    const content = await import("node:fs").then(fs => fs.promises.readFile(logFile, "utf-8"));
    return content.trim().split("\n").map(line => JSON.parse(line));
  } catch (error) {
    console.error("Failed to read session logs:", error);
    return [];
  }
}

// Get all logs
export async function getAllLogs(): Promise<CodexLogEntry[]> {
  try {
    const logsDir = getLogsDirectory();
    const masterLogFile = path.join(logsDir, "master.json");
    const content = await import("node:fs").then(fs => fs.promises.readFile(masterLogFile, "utf-8"));
    return content.trim().split("\n").map(line => JSON.parse(line));
  } catch (error) {
    console.error("Failed to read master logs:", error);
    return [];
  }
}

// Get log statistics
export async function getLogStats(): Promise<{
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  recentSessions: string[];
}> {
  const logs = await getAllLogs();
  const successful = logs.filter(log => log.success);
  const failed = logs.filter(log => !log.success);
  const averageDuration = logs.length > 0 
    ? logs.reduce((sum, log) => sum + log.duration, 0) / logs.length 
    : 0;
  const recentSessions = [...new Set(logs.map(log => log.sessionId))].slice(-10);

  return {
    totalExecutions: logs.length,
    successfulExecutions: successful.length,
    failedExecutions: failed.length,
    averageDuration: Math.round(averageDuration),
    recentSessions,
  };
}
