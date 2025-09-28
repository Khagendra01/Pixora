const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const scriptPath = path.join(repoRoot, "automation", "processPrompt.js");

const createTempProject = () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pixora-automation-test-"));
  fs.mkdirSync(path.join(tmpRoot, "docs"), { recursive: true });
  return tmpRoot;
};

test("processPrompt writes docs and logs without running orchestrator", (t) => {
  const tmpRoot = createTempProject();
  t.after(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  const payload = {
    summary: "Test story beat",
    characters: ["Hero"],
    scenes: ["Launch Deck"],
    objects: ["Control Panel"],
    actions: ["Hero activates launch sequence"],
    beats: [
      {
        name: "Intro",
        start: 0,
        end: 45,
        notes: "Establish setting",
      },
    ],
    fps: 24,
    narrativeStatus: "Prompt ingested in test.",
  };

  const result = spawnSync(
    "node",
    [scriptPath, "--skip-run", "--data", JSON.stringify(payload)],
    {
      cwd: repoRoot,
      env: { ...process.env, PROJECT_ROOT: tmpRoot },
      stdio: "pipe",
      encoding: "utf-8",
    },
  );

  assert.strictEqual(result.status, 0, result.stderr);

  const storyPath = path.join(tmpRoot, "docs", "story-overview.md");
  assert.ok(fs.existsSync(storyPath), "story-overview.md should exist");
  const storyContent = fs.readFileSync(storyPath, "utf-8");
  assert.match(storyContent, /Test story beat/);
  assert.match(storyContent, /Hero/);

  const inventoryPath = path.join(tmpRoot, "docs", "asset-inventory.md");
  assert.ok(fs.existsSync(inventoryPath), "asset-inventory.md should exist");
  const inventoryContent = fs.readFileSync(inventoryPath, "utf-8");
  assert.match(inventoryContent, /Hero activates launch sequence/);

  const timelinePath = path.join(tmpRoot, "docs", "timeline-grid.md");
  assert.ok(fs.existsSync(timelinePath), "timeline-grid.md should exist");
  const timelineContent = fs.readFileSync(timelinePath, "utf-8");
  assert.match(timelineContent, /Intro/);
  assert.match(timelineContent, /0-45/);

  const promptDir = path.join(tmpRoot, "docs", "chat-prompts");
  assert.ok(fs.existsSync(promptDir), "chat-prompts directory should exist");
  const logs = fs.readdirSync(promptDir);
  assert.strictEqual(logs.length, 1, "expected exactly one prompt log");
  const logContent = fs.readFileSync(path.join(promptDir, logs[0]), "utf-8");
  assert.match(logContent, /"summary": "Test story beat"/);
});
