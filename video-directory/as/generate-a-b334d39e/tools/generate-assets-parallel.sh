#!/bin/bash

# Simplified SVG Asset Generator using Codex
# Uses a single powerful codex command to generate all assets at once

set -e

echo "🚀 Starting simplified SVG generation with codex..."

# Create assets directory if it doesn't exist
mkdir -p assets

echo "🎨 Generating ALL SVG assets with single codex command..."

# Single powerful codex command to generate all assets
codex exec --dangerously-bypass-approvals-and-sandbox --sandbox=workspace-write --json \
  "Generate ALL SVG assets needed for this story in one go. Create background.svg, character.svg, character-2.svg, object.svg, vehicle.svg, and any other assets the story requires. Each file should be a complete, well-designed SVG that fits the story's visual style and narrative. Save each as a separate file in the assets/ directory."

echo ""
echo "🎉 All SVG assets generated with single codex command!"
echo "📁 Assets created:"
ls -la assets/*.svg 2>/dev/null || echo "   No SVG files found"

# Count generated files
ASSET_COUNT=$(ls assets/*.svg 2>/dev/null | wc -l)
echo "📊 Generated $ASSET_COUNT SVG files"

if [ $ASSET_COUNT -gt 0 ]; then
    echo "✅ Assets generated successfully!"
    exit 0
else
    echo "❌ No assets were generated"
    exit 1
fi
