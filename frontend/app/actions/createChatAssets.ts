"use server";

import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access, cp, mkdir } from "node:fs/promises";
import path from "node:path";

const templateDirectory = path.resolve(
  process.cwd(),
  "..",
  "init-template-video",
);
const videoRootDirectory = path.resolve(process.cwd(), "..", "video-directory");

type CommandResult = {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
};

function toSlugFromMessage(message: string, maxWords = 2) {
  const words = message
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .map((word) =>
      word
        .normalize("NFKD")
        .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase(),
    )
    .filter(Boolean);

  if (words.length === 0) {
    return "session";
  }

  return words.join("-");
}

async function runCommand(
  command: string,
  args: string[],
  options: { cwd: string },
): Promise<CommandResult> {
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
        exitCode: code ?? -1,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    });
  });
}

export async function initializeChatAssets({
  email,
  firstMessage,
}: {
  email: string;
  firstMessage: string;
}) {
  const trimmedMessage = firstMessage.trim();
  const trimmedEmail = email.trim();

  if (!trimmedMessage || !trimmedEmail) {
    return {
      status: "error" as const,
      message: "Email and first message are required.",
    };
  }

  try {
    await access(templateDirectory, constants.F_OK);
  } catch {
    return {
      status: "error" as const,
      message: "Video template directory is missing.",
    };
  }

  const [userId] = trimmedEmail.split("@");

  if (!userId) {
    return {
      status: "error" as const,
      message: "Unable to derive user id from email.",
    };
  }

  const userDirectory = path.join(videoRootDirectory, userId);
  await mkdir(userDirectory, { recursive: true });

  const baseFolderName = toSlugFromMessage(trimmedMessage);
  let finalFolderName = baseFolderName;
  let destinationDirectory = path.join(userDirectory, finalFolderName);
  let attempt = 1;

  while (true) {
    try {
      await access(destinationDirectory, constants.F_OK);
      finalFolderName = `${baseFolderName}-${attempt}`;
      destinationDirectory = path.join(userDirectory, finalFolderName);
      attempt += 1;
    } catch {
      break;
    }
  }

  await cp(templateDirectory, destinationDirectory, { recursive: true });

  const commandLogs: CommandResult[] = [];

  try {
    const installLog = await runCommand("npm", ["install"], {
      cwd: destinationDirectory,
    });
    commandLogs.push(installLog);

    if (installLog.exitCode !== 0) {
      return {
        status: "error" as const,
        message: "`npm install` failed while preparing the project.",
        commandLogs,
      };
    }

  } catch (error) {
    return {
      status: "error" as const,
      message: "We couldn't run the setup commands.",
      commandLogs,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return {
    status: "success" as const,
    relativePath: path.relative(process.cwd(), destinationDirectory),
    folderName: finalFolderName,
    commandLogs,
  };
}
