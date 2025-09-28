#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = process.env.PROJECT_ROOT
  ? path.resolve(process.env.PROJECT_ROOT)
  : path.resolve(__dirname, "..");
const docsDir = path.join(projectRoot, "docs");
const storyPath = path.join(docsDir, "story-overview.md");
const assetInventoryPath = path.join(docsDir, "asset-inventory.md");
const timelinePath = path.join(docsDir, "timeline-grid.md");
const promptLogDir = path.join(docsDir, "chat-prompts");

const readJSONFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = { skipRun: false };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case "--prompt":
        options.prompt = args[i + 1];
        i += 1;
        break;
      case "--prompt-file":
        options.prompt = fs.readFileSync(path.resolve(args[i + 1]), "utf-8");
        i += 1;
        break;
      case "--data":
        options.data = JSON.parse(args[i + 1]);
        i += 1;
        break;
      case "--data-file":
        options.data = readJSONFile(path.resolve(args[i + 1]));
        i += 1;
        break;
      case "--session-id":
        options.sessionId = args[i + 1];
        i += 1;
        break;
      case "--skip-run":
        options.skipRun = true;
        break;
      default:
        if (!arg.startsWith("--")) {
          options.prompt = arg;
        }
        break;
    }
  }
  return options;
};

const normalizeArray = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,|;|\|/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
  }
  return [];
};

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const toMarkdownList = (items, fallback) => {
  if (!items || items.length === 0) {
    return `- ${fallback}`;
  }
  return items.map((item) => `- ${item}`).join("\n");
};

const writeStoryOverview = ({ summary, narrativeStatus, characters, scenes, beats }) => {
  const timestamp = new Date().toISOString();
  const beatSummary = beats && beats.length > 0
    ? beats
        .map((beat) => `- ${beat.name || "Beat"}: ${beat.summary || beat.notes || "Refer to timeline."}`)
        .join("\n")
    : "- Refer to timeline grid for frame-level mapping.";

  const content = `# Story Overview\n\n- **Last Synced:** ${timestamp}\n- **Narrative Status:** ${narrativeStatus || "Auto-ingested from chat prompt."}\n\n## Summary\n${summary || "Awaiting summary."}\n\n## Characters\n${toMarkdownList(characters, "TBD from prompt analysis.")}\n\n## Scenes\n${toMarkdownList(scenes, "TBD from prompt analysis.")}\n\n## Timeline\n${beatSummary}\n`;

  ensureDir(path.dirname(storyPath));
  fs.writeFileSync(storyPath, `${content}`);
};

const writeAssetInventory = ({ characters, scenes, objects, actions }) => {
  const timestamp = new Date().toISOString();
  const content = `# Asset Inventory\n\n- **Last Synced:** ${timestamp}\n\n## Characters Needed\n${toMarkdownList(characters, "Add character descriptions.")}\n\n## Scenes Needed\n${toMarkdownList(scenes, "Add scene descriptors.")}\n\n## Objects & Props\n${toMarkdownList(objects, "Identify props from story.")}\n\n## Dynamic Actions\n${toMarkdownList(actions, "Note animation beats or transitions.")}\n`;

  ensureDir(path.dirname(assetInventoryPath));
  fs.writeFileSync(assetInventoryPath, `${content}`);
};

const formatFrameRange = (beat) => {
  if (beat.frameRange) {
    return beat.frameRange;
  }
  if (typeof beat.start === "number" && typeof beat.end === "number") {
    return `${beat.start}-${beat.end}`;
  }
  if (typeof beat.start === "number" && typeof beat.duration === "number") {
    return `${beat.start}-${beat.start + beat.duration}`;
  }
  return "TBD";
};

const formatDuration = (beat) => {
  if (typeof beat.duration === "number") {
    return String(beat.duration);
  }
  if (typeof beat.start === "number" && typeof beat.end === "number") {
    return String(beat.end - beat.start);
  }
  return beat.duration || "TBD";
};

const writeTimelineGrid = ({ fps, beats }) => {
  if (!beats || beats.length === 0) {
    if (!fs.existsSync(timelinePath)) {
      const timestamp = new Date().toISOString();
      const content = `# Timeline Grid\n\n- **Last Updated:** ${timestamp}\n- **Base FPS:** ${fps || 30}\n\n| Beat | Frame Range | Duration (frames) | Notes |\n| --- | --- | --- | --- |\n| Intro | 0-44 | 45 | Title reveal and establish setting |\n| Beat 2 | 45-89 | 45 | Hero pose with asset highlight |\n| Beat 3 | 90-119 | 30 | Particle emphasis break |\n| Beat 4 | 120-149 | 30 | Prepare transition to outro |\n| Outro | 150-179 | 30 | Fade to brand mark |\n`;
      fs.writeFileSync(timelinePath, `${content}`);
      return;
    }
    const existing = fs.readFileSync(timelinePath, "utf-8");
    const timestamp = new Date().toISOString();
    const updated = existing.replace(/(- \*\*Last Updated:\*\*).+/, `$1 ${timestamp}`);
    fs.writeFileSync(timelinePath, `${updated.trim()}\n`);
    return;
  }

  const timestamp = new Date().toISOString();
  const rows = beats
    .map((beat) => {
      const name = beat.name || "Beat";
      const frameRange = formatFrameRange(beat);
      const duration = formatDuration(beat);
      const notes = beat.notes || beat.summary || "";
      return `| ${name} | ${frameRange} | ${duration} | ${notes} |`;
    })
    .join("\n");

  const content = `# Timeline Grid\n\n- **Last Updated:** ${timestamp}\n- **Base FPS:** ${fps || 30}\n\n| Beat | Frame Range | Duration (frames) | Notes |\n| --- | --- | --- | --- |\n${rows}\n`;

  fs.writeFileSync(timelinePath, `${content}`);
};

const logPrompt = ({ prompt, data, sessionId, timestamp }) => {
  ensureDir(promptLogDir);
  const safeSession = sessionId ? sessionId.replace(/[^a-z0-9-_]/gi, "_") : "prompt";
  const fileName = `${timestamp}-${safeSession}.md`;
  const filePath = path.join(promptLogDir, fileName);
  const structured = data
    ? `\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`
    : "(none)";
  const payload = `# Chat Prompt\n\n- **Received:** ${timestamp}\n- **Session:** ${sessionId || "unknown"}\n\n## Raw Prompt\n${prompt || "(none provided)"}\n\n## Structured Data\n${structured}`;
  fs.writeFileSync(filePath, payload);
};

const runOrchestrator = () => {
  const orchestratorPath = path.join(projectRoot, "automation", "orchestrator.js");
  const result = spawnSync("node", [orchestratorPath, "run"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    const error = new Error(`Orchestrator exited with code ${result.status}`);
    error.code = result.status;
    throw error;
  }
};

const main = () => {
  const options = parseArgs();

  if (!options.prompt && !options.data) {
    const stdin = fs.readFileSync(0, "utf-8");
    options.prompt = stdin.trim();
  }

  const timestamp = new Date().toISOString();
  const data = options.data || {};
  const summary = data.summary || options.prompt || "";

  const characters = normalizeArray(data.characters);
  const scenes = normalizeArray(data.scenes);
  const objects = normalizeArray(data.objects);
  const actions = normalizeArray(data.actions);
  const beats = Array.isArray(data.beats) ? data.beats : [];

  writeStoryOverview({
    summary,
    narrativeStatus: data.narrativeStatus || "Auto-ingested from chat prompt.",
    characters,
    scenes,
    beats,
  });

  writeAssetInventory({ characters, scenes, objects, actions });
  writeTimelineGrid({ fps: data.fps || data.baseFps, beats });
  logPrompt({ prompt: options.prompt, data, sessionId: options.sessionId, timestamp });

  if (!options.skipRun) {
    runOrchestrator();
  }
};

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(err.code || 1);
}
