import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { type AppContent, DEFAULT_APP_CONTENT } from "@/lib/appContent";

const dataDirectory = path.join(process.cwd(), "data");
const appContentPath = path.join(dataDirectory, "appContent.json");

async function readFile(): Promise<AppContent> {
  const file = await fs.readFile(appContentPath, "utf-8");
  const parsed = JSON.parse(file) as AppContent;
  return parsed;
}

export const readAppContent = cache(async (): Promise<AppContent> => {
  try {
    return await readFile();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return DEFAULT_APP_CONTENT;
    }
    throw error;
  }
});
