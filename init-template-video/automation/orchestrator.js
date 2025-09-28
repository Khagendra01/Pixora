#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const docsDir = path.join(projectRoot, "docs");
const assetsDir = path.join(projectRoot, "assets");
const publicDir = path.join(projectRoot, "public");

const MANIFEST_PATH = path.join(docsDir, "automation-manifest.md");
const TODO_PATH = path.join(projectRoot, "TODO.md");

const SECTION_HEADING_COMPLETED = "## ✅ COMPLETED TASKS";
const SECTION_HEADING_NOTES = "## 📝 NOTES";

const log = (message) => {
  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${timestamp}] ${message}`);
};

const readFileSafe = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
};

const writeFileRecursive = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
};

const loadManifest = () => {
  const manifestMarkdown = readFileSafe(MANIFEST_PATH);
  if (!manifestMarkdown) {
    throw new Error(`Manifest not found at ${MANIFEST_PATH}`);
  }

  const jsonMatch = manifestMarkdown.match(/<!-- PIPELINE-SPEC-JSON:START -->[\s\S]*?```json([\s\S]*?)```/);
  if (!jsonMatch) {
    throw new Error("Unable to locate pipeline JSON block in manifest.");
  }

  try {
    const spec = JSON.parse(jsonMatch[1].trim());
    return spec;
  } catch (err) {
    throw new Error(`Failed to parse manifest JSON: ${err.message}`);
  }
};

const updateTodoWithPhase = (phaseId, status) => {
  const todo = readFileSafe(TODO_PATH);
  if (!todo) {
    return;
  }

  const lines = todo.split(/\r?\n/);
  const insertionIndex = lines.findIndex((line) => line.trim() === SECTION_HEADING_COMPLETED);
  if (insertionIndex === -1) {
    return;
  }

  const timestamp = new Date().toISOString();
  const bullet = `- ${timestamp} – Phase \`${phaseId}\` ${status}.`;

  let nextSectionIndex = lines.findIndex((line, idx) => idx > insertionIndex && line.startsWith("## "));
  if (nextSectionIndex === -1) {
    nextSectionIndex = lines.length;
  }

  const alreadyLogged = lines.slice(insertionIndex + 1, nextSectionIndex).some((line) => line.includes(`Phase \`${phaseId}\``) && line.includes(status));

  if (!alreadyLogged) {
    lines.splice(insertionIndex + 1, 0, bullet);
    fs.writeFileSync(TODO_PATH, `${lines.join("\n")}\n`, "utf-8");
  }
};

const verifyArtifacts = (artifacts) => {
  const missing = artifacts.filter((artifact) => {
    const artifactPath = path.join(projectRoot, artifact);
    return !fs.existsSync(artifactPath);
  });

  if (missing.length > 0) {
    throw new Error(`Missing expected artifacts: ${missing.join(", ")}`);
  }
};

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      cwd: projectRoot,
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
};

const runAgentCommand = async (agentConfig) => {
  await runCommand(agentConfig.command);
  if (Array.isArray(agentConfig.expectedArtifacts) && agentConfig.expectedArtifacts.length > 0) {
    verifyArtifacts(agentConfig.expectedArtifacts);
  }
};

const resolvePhaseOrder = (phases) => {
  const phaseMap = new Map(phases.map((phase) => [phase.id, phase]));
  const completed = new Set();
  const ordered = [];

  while (completed.size < phases.length) {
    const nextPhase = phases.find((phase) => {
      if (completed.has(phase.id)) {
        return false;
      }
      return phase.dependsOn.every((dependency) => completed.has(dependency));
    });

    if (!nextPhase) {
      const unresolved = phases.filter((phase) => !completed.has(phase.id)).map((phase) => phase.id);
      throw new Error(`Cyclic or unsatisfied dependencies detected: ${unresolved.join(", ")}`);
    }

    ordered.push(nextPhase);
    completed.add(nextPhase.id);
  }

  return { ordered, phaseMap };
};

const runPhase = async (phase) => {
  log(`Starting phase ${phase.id} (${phase.mode})`);
  if (phase.mode === "sequential") {
    for (const agent of phase.agents) {
      log(`Running agent ${agent.id}`);
      await runAgentCommand(agent);
    }
  } else if (phase.mode === "parallel") {
    await Promise.all(
      phase.agents.map(async (agent) => {
        log(`Running agent ${agent.id} in parallel`);
        await runAgentCommand(agent);
      }),
    );
  } else {
    throw new Error(`Unknown mode '${phase.mode}' for phase ${phase.id}`);
  }
  updateTodoWithPhase(phase.id, "completed");
  log(`Phase ${phase.id} completed.`);
};

const ensureBaseStructure = () => {
  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
};

// Agent Implementations ----------------------------------------------------

const appendAutomationChangelog = (entry) => {
  const changelogPath = path.join(docsDir, "automation-changelog.md");
  const timestamp = new Date().toISOString();
  const existing = readFileSafe(changelogPath);
  const line = `- ${timestamp} – ${entry}`;
  if (!existing) {
    writeFileRecursive(
      changelogPath,
      `# Automation Changelog\n\n${line}\n`,
    );
    return;
  }
  if (!existing.includes(line)) {
    writeFileRecursive(changelogPath, `${existing.trim()}\n${line}\n`);
  }
};

const updateTodoSection = (sectionHeading, updater) => {
  const content = readFileSafe(TODO_PATH);
  if (!content) {
    return;
  }
  const lines = content.split(/\r?\n/);
  const sectionIndex = lines.findIndex((line) => line.trim() === sectionHeading);
  if (sectionIndex === -1) {
    return;
  }
  let nextSectionIndex = lines.findIndex((line, idx) => idx > sectionIndex && line.startsWith("## "));
  if (nextSectionIndex === -1) {
    nextSectionIndex = lines.length;
  }
  const before = lines.slice(0, sectionIndex + 1);
  const sectionBody = lines.slice(sectionIndex + 1, nextSectionIndex);
  const after = lines.slice(nextSectionIndex);
  const updatedSectionBody = updater(sectionBody);
  const updated = [...before, ...updatedSectionBody, ...after].join("\n");
  fs.writeFileSync(TODO_PATH, `${updated}\n`, "utf-8");
};

const ensureTodoNote = (note) => {
  updateTodoSection(SECTION_HEADING_NOTES, (body) => {
    if (body.some((line) => line.includes(note))) {
      return body;
    }
    return [note, ...body];
  });
};

const upsertDocWithTimestamp = ({ filePath, marker, template }) => {
  const timestamp = new Date().toISOString();
  const existing = readFileSafe(filePath);
  if (!existing) {
    const content = template(timestamp);
    writeFileRecursive(filePath, content);
    return timestamp;
  }

  const updated = existing.replace(
    new RegExp(`(- \\\\*\\\\*${marker}\\\\*\\\\*:).+`),
    `$1 ${timestamp}`,
  );
  writeFileRecursive(filePath, `${updated.trim()}\n`);
  return timestamp;
};

const runStoryIntakeAgent = () => {
  const storyPath = path.join(docsDir, "story-overview.md");
  const assetInventoryPath = path.join(docsDir, "asset-inventory.md");

  const storyTimestamp = upsertDocWithTimestamp({
    filePath: storyPath,
    marker: "Last Synced",
    template: (timestamp) => `# Story Overview\n\n- **Last Synced:** ${timestamp}\n- **Narrative Status:** Awaiting latest story payload. Update beats and character details when available.\n\n## Summary\nProvide a concise synopsis of the active narrative once source material is available.\n\n## Characters\n- Main Character: Describe appearance, motivation, and key arc.\n- Supporting Cast: List roles and narrative function.\n\n## Scenes\nOutline each scene with setting, mood, and conflict cues.\n\n## Timeline\nMap story beats to approximate timestamps or frame ranges.\n`,
  });

  upsertDocWithTimestamp({
    filePath: assetInventoryPath,
    marker: "Last Synced",
    template: (timestamp) => `# Asset Inventory\n\n- **Last Synced:** ${timestamp}\n\n## Characters Needed\n- Hero: Foreground performer with expressive silhouette.\n- Supporting Figure: Secondary presence for depth.\n\n## Scenes Needed\n- Primary Set: Environment for the main action.\n- Atmospheric Backdrop: Reinforces tone and palette.\n\n## Objects & Props\n- Interactive Prop: Visible during key beats.\n- Ambient Elements: Particles or lighting to add motion density.\n\n## Dynamic Actions\n- Hero: Establishing pose to highlight silhouette.\n- Camera: Slow push-in across mid sequence.\n- Particles: Looping sparkle path triggered in climax.\n`,
  });

  updateTodoSection(SECTION_HEADING_COMPLETED, (body) => {
    const entry = `- ${storyTimestamp} – Story intake baseline synced.`;
    if (body.some((line) => line.includes("Story intake baseline synced"))) {
      return body;
    }
    return [entry, ...body];
  });

  appendAutomationChangelog("Story overview and asset inventory synced.");
};

const runDocHandoffAgent = () => {
  const timelinePath = path.join(docsDir, "timeline-grid.md");
  const timestamp = upsertDocWithTimestamp({
    filePath: timelinePath,
    marker: "Last Updated",
    template: (stamp) => `# Timeline Grid\n\n- **Last Updated:** ${stamp}\n- **Base FPS:** 30\n\n| Beat | Frame Range | Duration (frames) | Notes |\n| --- | --- | --- | --- |\n| Intro | 0-44 | 45 | Title reveal and establish setting |\n| Beat 2 | 45-89 | 45 | Hero pose with asset highlight |\n| Beat 3 | 90-119 | 30 | Particle emphasis break |\n| Beat 4 | 120-149 | 30 | Prepare transition to outro |\n| Outro | 150-179 | 30 | Fade to brand mark |\n`,
  });

  appendAutomationChangelog("Timeline grid refreshed for latest production pass.");

  ensureTodoNote("- Documentation agents should update timeline-grid.md whenever beats shift.");
};

const syncToPublic = (relativePath) => {
  const source = path.join(projectRoot, relativePath);
  const target = path.join(publicDir, relativePath.replace(/^assets\//, "assets/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
};

const createSvgAsset = (filePath, svgContent, relativePublicPath) => {
  const shouldWrite = !fs.existsSync(filePath);
  if (shouldWrite) {
    writeFileRecursive(filePath, svgContent);
  }
  syncToPublic(relativePublicPath);
};

const writeJson = (filePath, data) => {
  writeFileRecursive(filePath, `${JSON.stringify(data, null, 2)}\n`);
};

const runAssetCharacterAgent = () => {
  const timestamp = new Date().toISOString();
  const relativePath = "assets/characters/main/character-main-hero-192x192.svg";
  const svgPath = path.join(projectRoot, relativePath);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">\n  <metadata>\n    <title>Hero Silhouette</title>\n    <author>Pixora Automation</author>\n    <created>${timestamp}</created>\n    <version>1.0</version>\n  </metadata>\n  <defs>\n    <linearGradient id="heroBody" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="#1E3A8A"/>\n      <stop offset="100%" stop-color="#3B82F6"/>\n    </linearGradient>\n  </defs>\n  <g fill="none" stroke="#0F172A" stroke-width="4">\n    <path fill="url(#heroBody)" d="M96 12c24 0 40 16 40 40 0 20-12 32-24 36 18 6 36 24 36 54v38H44v-38c0-30 18-48 36-54-12-4-24-16-24-36 0-24 16-40 40-40z"/>\n    <circle cx="96" cy="56" r="32" fill="rgba(255,255,255,0.2)"/>\n  </g>\n</svg>\n`;
  createSvgAsset(svgPath, svg, relativePath);

  const registryPath = path.join(projectRoot, "src", "assets", "registry", "characters.json");
  const data = {
    category: "characters",
    updatedAt: timestamp,
    items: [
      {
        id: "character-main-hero-192x192",
        file: relativePath,
        publicPath: "/assets/characters/main/character-main-hero-192x192.svg",
        role: "main",
        palette: ["#1E3A8A", "#3B82F6", "#F59E0B"],
        description: "Stylized hero silhouette for focal composition beats.",
      },
    ],
  };
  writeJson(registryPath, data);
  appendAutomationChangelog("Character asset registry refreshed.");
};

const runAssetBackgroundAgent = () => {
  const timestamp = new Date().toISOString();
  const relativePath = "assets/backgrounds/abstract/background-abstract-wave-1920x1080.svg";
  const svgPath = path.join(projectRoot, relativePath);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">\n  <metadata>\n    <title>Abstract Wave Background</title>\n    <author>Pixora Automation</author>\n    <created>${timestamp}</created>\n    <version>1.0</version>\n  </metadata>\n  <defs>\n    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">\n      <stop offset="0%" stop-color="#1F2937"/>\n      <stop offset="100%" stop-color="#0F172A"/>\n    </linearGradient>\n    <linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%">\n      <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.8"/>\n      <stop offset="100%" stop-color="#22D3EE" stop-opacity="0.6"/>\n    </linearGradient>\n  </defs>\n  <rect width="1920" height="1080" fill="url(#sky)"/>\n  <path d="M0 780 Q320 700 640 760 T1280 740 T1920 820 V1080 H0 Z" fill="url(#wave)"/>\n  <ellipse cx="1560" cy="260" rx="220" ry="140" fill="rgba(255,255,255,0.08)"/>\n</svg>\n`;
  createSvgAsset(svgPath, svg, relativePath);

  const registryPath = path.join(projectRoot, "src", "assets", "registry", "backgrounds.json");
  const data = {
    category: "backgrounds",
    updatedAt: timestamp,
    items: [
      {
        id: "background-abstract-wave-1920x1080",
        file: relativePath,
        publicPath: "/assets/backgrounds/abstract/background-abstract-wave-1920x1080.svg",
        palette: ["#1F2937", "#0F172A", "#3B82F6", "#22D3EE"],
        description: "Gradient wave background suited for hero compositions.",
      },
    ],
  };
  writeJson(registryPath, data);
  appendAutomationChangelog("Background asset registry refreshed.");
};

const runAssetEffectsAgent = () => {
  const timestamp = new Date().toISOString();
  const relativePath = "assets/effects/particles/effect-particle-sparkle-64x64.svg";
  const svgPath = path.join(projectRoot, relativePath);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n  <metadata>\n    <title>Sparkle Particle Effect</title>\n    <author>Pixora Automation</author>\n    <created>${timestamp}</created>\n    <version>1.0</version>\n  </metadata>\n  <defs>\n    <radialGradient id="sparkle" cx="0.5" cy="0.5" r="0.5">\n      <stop offset="0%" stop-color="#FDE68A"/>\n      <stop offset="50%" stop-color="#FBBF24"/>\n      <stop offset="100%" stop-color="rgba(251, 191, 36, 0)"/>
    </radialGradient>
  </defs>
  <circle cx="32" cy="32" r="24" fill="url(#sparkle)"/>
  <path d="M32 6 L36 24 L58 28 L36 32 L32 58 L28 32 L6 28 L28 24 Z" fill="#FACC15" opacity="0.7"/>
</svg>
`;
  createSvgAsset(svgPath, svg, relativePath);

  const registryPath = path.join(projectRoot, "src", "assets", "registry", "effects.json");
  const data = {
    category: "effects",
    updatedAt: timestamp,
    items: [
      {
        id: "effect-particle-sparkle-64x64",
        file: relativePath,
        publicPath: "/assets/effects/particles/effect-particle-sparkle-64x64.svg",
        description: "Sparkle particle for highlight beats.",
        animationHint: "Seeded random jitter for sparkle offsets.",
      },
    ],
  };
  writeJson(registryPath, data);
  appendAutomationChangelog("Effects asset registry refreshed.");
};

const runAssetRegistryMergeAgent = () => {
  const registryDir = path.join(projectRoot, "src", "assets", "registry");
  const files = fs.existsSync(registryDir) ? fs.readdirSync(registryDir).filter((file) => file.endsWith(".json")) : [];
  const merged = {};

  files.forEach((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(registryDir, file), "utf-8"));
    if (data && data.category && Array.isArray(data.items)) {
      merged[data.category] = data.items;
    }
  });

  const modulePath = path.join(projectRoot, "src", "assets", "assetRegistry.js");
  const fileContent = `// Generated by automation/orchestrator.js\nconst assetRegistry = ${JSON.stringify(merged, null, 2)};\n\nexport const getAssetsByCategory = (category) => {\n  return assetRegistry[category] ?? [];\n};\n\nexport const getAssetById = (id) => {\n  for (const category of Object.values(assetRegistry)) {\n    const match = category.find((item) => item.id === id);\n    if (match) {\n      return match;\n    }\n  }\n  return null;\n};\n\nexport const categories = Object.keys(assetRegistry);\n\nexport default assetRegistry;\n`;
  writeFileRecursive(modulePath, fileContent);
  appendAutomationChangelog("Asset registry merged into assetRegistry.js.");
};

const ensureTimelinesUtil = () => {
  const timelineUtilPath = path.join(projectRoot, "src", "timelines", "index.js");
  if (fs.existsSync(timelineUtilPath)) {
    return;
  }
  const content = `import { interpolate } from "remotion";\n\nexport const createLinearTimeline = ({ frame, start, end, from = 0, to = 1 }) => {\n  return interpolate(frame, [start, end], [from, to], { extrapolateLeft: \"clamp\", extrapolateRight: \"clamp\" });\n};\n`;
  writeFileRecursive(timelineUtilPath, content);
};

const runSceneMainAgent = () => {
  ensureTimelinesUtil();
  const scenePath = path.join(projectRoot, "src", "scenes", "scene-main.jsx");
  const compositionPath = path.join(projectRoot, "src", "compositions", "main.jsx");

  const sceneContent = `import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from \"remotion\";\nimport assetRegistry, { getAssetById } from \"../assets/assetRegistry\";\n\nconst heroAsset = getAssetById(\"character-main-hero-192x192\");\nconst backgroundAsset = getAssetById(\"background-abstract-wave-1920x1080\");\nconst sparkleAsset = getAssetById(\"effect-particle-sparkle-64x64\");\n\nconst getSrc = (asset) => {\n  if (!asset || !asset.publicPath) {\n    return null;\n  }\n  return staticFile(asset.publicPath);\n};\n\nexport const SceneMain = () => {\n  const frame = useCurrentFrame();\n  const heroTranslate = interpolate(frame, [0, 45], [400, 0], { extrapolateLeft: \"clamp\", extrapolateRight: \"clamp\" });\n  const sparkleOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: \"clamp\", extrapolateRight: \"clamp\" });\n\n  return (\n    <AbsoluteFill style={{ backgroundColor: \"#020617\" }}>\n      {backgroundAsset && (\n        <Img src={getSrc(backgroundAsset)} style={{ width: \"100%\", height: \"100%\" }} />\n      )}\n      {heroAsset && (\n        <Img\n          src={getSrc(heroAsset)}\n          style={{\n            position: \"absolute\",\n            width: 480,\n            left: \`calc(50% - 240px)\`,\n            bottom: 120,\n            transform: \`translateX(\${heroTranslate}px)\`,\n          }}\n        />\n      )}\n      {sparkleAsset && (\n        <Img\n          src={getSrc(sparkleAsset)}\n          style={{\n            position: \"absolute\",\n            width: 120,\n            left: \"60%\",\n            top: \"35%\",\n            opacity: sparkleOpacity,\n          }}\n        />\n      )}\n      <div\n        style={{\n          position: \"absolute\",\n          left: \"10%\",\n          top: \"10%\",\n          color: \"#FACC15\",\n          fontSize: 72,\n          fontWeight: 600,\n          letterSpacing: 3,\n        }}\n      >\n        Pixora Showcase\n      </div>\n    </AbsoluteFill>\n  );\n};\n\nexport default SceneMain;\n`;

  const compositionContent = `import { Composition } from \"remotion\";\nimport { SceneMain } from \"../scenes/scene-main\";\n\nexport const MainComposition = () => {\n  return (\n    <Composition\n      id=\"MainScene\"\n      component={SceneMain}\n      durationInFrames={180}\n      fps={30}\n      width={1920}\n      height={1080}\n    />\n  );\n};\n\nexport default MainComposition;\n`;

  writeFileRecursive(scenePath, sceneContent);
  writeFileRecursive(compositionPath, compositionContent);

  appendAutomationChangelog("Scene Main composition wired.");
};

const runSceneAltAgent = () => {
  ensureTimelinesUtil();
  const scenePath = path.join(projectRoot, "src", "scenes", "scene-alt.jsx");
  const content = `import { AbsoluteFill, useCurrentFrame } from \"remotion\";\nimport { createLinearTimeline } from \"../timelines\";\n\nexport const SceneAlt = () => {\n  const frame = useCurrentFrame();\n  const glow = createLinearTimeline({ frame, start: 0, end: 60, from: 0.2, to: 0.8 });\n  return (\n    <AbsoluteFill\n      style={{\n        background: \"radial-gradient(circle at 50% 40%, rgba(59,130,246,0.6), rgba(15,23,42,1))\",\n        boxShadow: \`0 0 160px rgba(250,204,21,\${glow})\`,\n      }}\n    />\n  );\n};\n\nexport default SceneAlt;\n`;
  writeFileRecursive(scenePath, content);
  appendAutomationChangelog("Scene Alt environment generated.");
};

const runQaAgent = async () => {
  const lintResult = await runCommand("npm run lint");
  void lintResult;
  const performanceNotesPath = path.join(docsDir, "performance-notes.md");
  const timestamp = new Date().toISOString();
  const note = `- ${timestamp} – Lint checks executed via automation orchestrator.`;
  const existing = readFileSafe(performanceNotesPath);
  if (!existing) {
    writeFileRecursive(performanceNotesPath, `# Performance Notes\n\n${note}\n`);
  } else if (!existing.includes(note)) {
    writeFileRecursive(performanceNotesPath, `${existing.trim()}\n${note}\n`);
  }
  appendAutomationChangelog("QA agent completed lint run.");
};

const runRenderAgent = async () => {
  const bundleDir = path.join(projectRoot, "build");
  fs.mkdirSync(bundleDir, { recursive: true });
  const command = "npx remotion bundle src/index.js";
  await runCommand(command);
  const deliveryLogPath = path.join(docsDir, "delivery-log.md");
  const timestamp = new Date().toISOString();
  const message = `- ${timestamp} – Bundled Remotion project to build/.`;
  const existing = readFileSafe(deliveryLogPath);
  if (!existing) {
    writeFileRecursive(deliveryLogPath, `# Delivery Log\n\n${message}\n`);
  } else if (!existing.includes(message)) {
    writeFileRecursive(deliveryLogPath, `${existing.trim()}\n${message}\n`);
  }
  appendAutomationChangelog("Render agent exported MainScene.");
};

const agentHandlers = new Map([
  ["story-intake", runStoryIntakeAgent],
  ["doc-handoff", runDocHandoffAgent],
  ["asset-character", runAssetCharacterAgent],
  ["asset-background", runAssetBackgroundAgent],
  ["asset-effects", runAssetEffectsAgent],
  ["asset-registry-merge", runAssetRegistryMergeAgent],
  ["scene-main", runSceneMainAgent],
  ["scene-alt", runSceneAltAgent],
  ["qa", runQaAgent],
  ["render", runRenderAgent],
]);

const runAgentById = async (id) => {
  const handler = agentHandlers.get(id);
  if (!handler) {
    throw new Error(`No handler registered for agent '${id}'.`);
  }
  const result = handler();
  if (result && typeof result.then === "function") {
    await result;
  }
};

const runPipeline = async () => {
  ensureBaseStructure();
  const manifest = loadManifest();
  const { ordered } = resolvePhaseOrder(manifest.phases);

  for (const phase of ordered) {
    await runPhase(phase);
  }
};

const printUsage = () => {
  // eslint-disable-next-line no-console
  console.log(`Usage:\n  node automation/orchestrator.js run            # Run full pipeline\n  node automation/orchestrator.js phase <id>    # Run a single phase\n  node automation/orchestrator.js agent <id>    # Run a single agent handler`);
};

const argv = process.argv.slice(2);

const main = async () => {
  if (argv.length === 0) {
    printUsage();
    process.exit(1);
  }

  const [command, id] = argv;

  try {
    switch (command) {
      case "run":
        await runPipeline();
        break;
      case "phase": {
        ensureBaseStructure();
        if (!id) {
          throw new Error("Phase id is required.");
        }
        const manifest = loadManifest();
        const phase = manifest.phases.find((p) => p.id === id);
        if (!phase) {
          throw new Error(`Phase '${id}' not found.`);
        }
        await runPhase(phase);
        break;
      }
      case "agent":
        ensureBaseStructure();
        if (!id) {
          throw new Error("Agent id is required.");
        }
        await runAgentById(id);
        break;
      default:
        printUsage();
        process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

main();
