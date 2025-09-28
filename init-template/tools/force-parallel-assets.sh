#!/bin/bash

# Force Parallel Asset Generation (SVG + Audio)
# This script ensures the parallel generators are ALWAYS used

echo "🚀 FORCING PARALLEL ASSET GENERATION (SVG + Audio)..."

# Check if parallel generators exist
if [ ! -f "tools/generate-assets-parallel.sh" ]; then
    echo "❌ ERROR: SVG parallel generator not found at tools/generate-assets-parallel.sh"
    exit 1
fi

if [ ! -f "tools/parallel-audio-generator.sh" ]; then
    echo "❌ ERROR: Audio parallel generator not found at tools/parallel-audio-generator.sh"
    exit 1
fi

# Make sure they're executable
chmod +x tools/generate-assets-parallel.sh
chmod +x tools/parallel-audio-generator.sh

echo "🎨 Starting parallel SVG generation..."
bash tools/generate-assets-parallel.sh &
SVG_PID=$!

echo "🎵 Starting parallel audio generation..."
bash tools/parallel-audio-generator.sh &
AUDIO_PID=$!

# Wait for both processes to complete
wait $SVG_PID
SVG_RESULT=$?

wait $AUDIO_PID
AUDIO_RESULT=$?

# Check results
echo ""
echo "📊 PARALLEL GENERATION RESULTS:"

if [ $SVG_RESULT -eq 0 ]; then
    echo "✅ SVG generation completed successfully!"
    ASSET_COUNT=$(ls assets/*.svg 2>/dev/null | wc -l)
    echo "📁 Generated $ASSET_COUNT SVG files"
else
    echo "❌ SVG generation failed!"
fi

if [ $AUDIO_RESULT -eq 0 ]; then
    echo "✅ Audio generation completed successfully!"
    AUDIO_COUNT=$(ls public/audio/*.mp3 2>/dev/null | wc -l)
    echo "🎵 Downloaded $AUDIO_COUNT audio files"
else
    echo "❌ Audio generation failed!"
fi

# Overall success if at least SVG generation succeeded
if [ $SVG_RESULT -eq 0 ]; then
    echo "🎉 Parallel asset generation completed!"
    exit 0
else
    echo "❌ Parallel asset generation failed!"
    exit 1
fi
