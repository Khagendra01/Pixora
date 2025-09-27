"use server";
import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { access, cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { main as runAgentCommand } from "./agent";

const templateDirectory = path.resolve(
  process.cwd(),
  "..",
  "init-template-video",
);
const videoRootDirectory = path.resolve(process.cwd(), "..", "video-directory");
function toSlugFromMessage(message, maxWords = 2) {
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
export async function initializeChatAssets({ email, firstMessage }) {
  const trimmedMessage = firstMessage.trim();
  const trimmedEmail = email.trim();
  if (!trimmedMessage || !trimmedEmail) {
    return {
      status: "error",
      message: "Email and first message are required.",
    };
  }
  try {
    await access(templateDirectory, constants.F_OK);
  } catch (_a) {
    return {
      status: "error",
      message: "Video template directory is missing.",
    };
  }
  const [userId] = trimmedEmail.split("@");
  if (!userId) {
    return {
      status: "error",
      message: "Unable to derive user id from email.",
    };
  }
  const userDirectory = path.join(videoRootDirectory, userId);
  await mkdir(userDirectory, { recursive: true });
  const baseFolderName = toSlugFromMessage(trimmedMessage);
  const uniqueSuffix = randomUUID().split("-")[0];
  let finalFolderName = `${baseFolderName}-${uniqueSuffix}`;
  let destinationDirectory = path.join(userDirectory, finalFolderName);
  let attempt = 1;
  while (true) {
    try {
      await access(destinationDirectory, constants.F_OK);
      finalFolderName = `${baseFolderName}-${uniqueSuffix}-${attempt}`;
      destinationDirectory = path.join(userDirectory, finalFolderName);
      attempt += 1;
    } catch (_b) {
      break;
    }
  }
  await cp(templateDirectory, destinationDirectory, { recursive: true });
  const commandLogs = [];
  try {
    const codexLog = await runAgentCommand({
      cwd: destinationDirectory,
      message: trimmedMessage,
    });
    commandLogs.push(codexLog);
    if (codexLog.exitCode !== 0) {
      return {
        status: "error",
        message: "`codex` failed while preparing the project.",
        commandLogs,
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "We couldn't run the `codex` command.",
      commandLogs,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  return {
    status: "success",
    relativePath: path.relative(process.cwd(), destinationDirectory),
    folderName: finalFolderName,
    commandLogs,
  };
}
export async function runCodexInExistingAssets({ relativePath, message }) {
  const trimmedMessage = message.trim();
  const trimmedRelativePath = relativePath.trim();
  if (!trimmedMessage || !trimmedRelativePath) {
    return {
      status: "error",
      message: "Asset directory and message are required.",
      commandLogs: [],
    };
  }
  const normalizedRelativePath = path.normalize(trimmedRelativePath);
  const destinationDirectory = path.resolve(
    process.cwd(),
    normalizedRelativePath,
  );
  const relativeToRoot = path.relative(
    videoRootDirectory,
    destinationDirectory,
  );
  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return {
      status: "error",
      message: "Invalid asset directory for codex execution.",
      commandLogs: [],
    };
  }
  try {
    await access(destinationDirectory, constants.F_OK);
  } catch (_a) {
    return {
      status: "error",
      message: "Saved asset directory is missing.",
      commandLogs: [],
    };
  }
  const commandLogs = [];
  try {
    const codexLog = await runAgentCommand({
      cwd: destinationDirectory,
      message: trimmedMessage,
    });
    commandLogs.push(codexLog);
    if (codexLog.exitCode !== 0) {
      return {
        status: "error",
        message: "`codex` failed while preparing the project.",
        commandLogs,
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "We couldn't run the `codex` command.",
      commandLogs,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  return {
    status: "success",
    commandLogs,
    relativePath: normalizedRelativePath,
  };
}
