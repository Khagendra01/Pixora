# Agents Guidance

## Quick Start
1. **Create your story composition** in `src/` directory
2. **Add composition to `src/Root.jsx`** for preview
3. **Run `npm run dev`** to start Remotion studio
4. **Access studio at http://localhost:3001** to preview and render

## Key Files
- `AUTOMATION-AGENT.md` - Step-by-step production runbook
- `MISSION-BRIEF.md` - Story intake and execution order  
- `PRODUCTION-GUARDRAILS.md` - Structure, naming, and QA requirements

## Important Notes
- **DO NOT run `npx` commands** - use `npm run dev` instead
- **Place compositions in `src/Root.jsx`** for studio preview
- **Assets go in `public/assets/`** directory
- **Studio runs on port 3001** by default
- **Codex runs non-interactively** - no approval prompts needed

## Codex Configuration
The system uses `codex exec` with these flags for automated execution:
- `--dangerously-bypass-approvals-and-sandbox` - Skip approval prompts
- `--sandbox workspace-write` - Allow workspace modifications
- 10-minute timeout for completion

When asked to generate a story video, follow the automation agent guide and ensure the composition is properly registered in Root.jsx for preview.
