#!/bin/bash

# Parallel Audio Generator
# Downloads audio files in parallel with other asset generation

set -e

echo "🎵 Starting parallel audio generation..."

# Create audio directory if it doesn't exist
mkdir -p public/audio

# Function to download audio from MyInstants API
download_audio() {
    local query="$1"
    local output_file="$2"
    
    echo "🎵 Downloading audio for: $query"
    
    # Get the MP3 URL from MyInstants API
    MP3_URL=$(curl -s "https://myinstants-api.vercel.app/search?q=$query" \
        | jq -r '.data[0].mp3' 2>/dev/null)
    
    if [ "$MP3_URL" != "null" ] && [ -n "$MP3_URL" ]; then
        # Download the audio file
        curl -L "$MP3_URL" -o "public/audio/$output_file" 2>/dev/null
        
        if [ -f "public/audio/$output_file" ]; then
            echo "✅ Downloaded: $output_file"
            return 0
        else
            echo "❌ Failed to download: $output_file"
            return 1
        fi
    else
        echo "❌ No audio found for: $query"
        return 1
    fi
}

# Function to analyze story and determine what audio is needed
analyze_audio_needs() {
    echo "🎵 Analyzing story for audio requirements..."
    
    # Use codex to analyze what audio files are needed
    AUDIO_NEEDED=$(codex exec --dangerously-bypass-approvals-and-sandbox --sandbox=workspace-write --json \
        "Analyze this story and determine what audio files are needed. Return a JSON array of audio queries like: [\"daisybell\", \"music\", \"sound\"]" 2>/dev/null | jq -r '.data[0].content' 2>/dev/null || echo '["daisybell"]')
    
    if [ -z "$AUDIO_NEEDED" ]; then
        # Fallback to basic audio if analysis fails
        AUDIO_NEEDED='["daisybell"]'
    fi
    
    echo "🎵 Audio needed: $AUDIO_NEEDED"
    echo "$AUDIO_NEEDED"
}

# Analyze story to get required audio
AUDIO_JSON=$(analyze_audio_needs)

# Parse JSON and create audio list
AUDIO_LIST=$(echo "$AUDIO_JSON" | sed 's/\[//g' | sed 's/\]//g' | sed 's/"//g' | tr ',' '\n' | tr -d ' ')

echo "🎵 Starting parallel audio download for: $AUDIO_LIST"

# Start all download processes in parallel
PIDS=()
AUDIO_COUNT=0

for audio_query in $AUDIO_LIST; do
    # Determine filename
    case "$audio_query" in
        "daisybell") filename="daisy-bell.mp3" ;;
        "music") filename="background-music.mp3" ;;
        "sound") filename="sound-effect.mp3" ;;
        *) filename="${audio_query}.mp3" ;;
    esac
    
    # Start download in background
    download_audio "$audio_query" "$filename" &
    PIDS+=($!)
    AUDIO_COUNT=$((AUDIO_COUNT + 1))
done

# Wait for all background processes to complete
for pid in "${PIDS[@]}"; do
    wait $pid
done

echo ""
echo "🎉 All audio files downloaded in parallel!"
echo "🎵 Audio files created:"
ls -la public/audio/*.mp3 2>/dev/null || echo "   No audio files found"

# Count downloaded files
AUDIO_FILE_COUNT=$(ls public/audio/*.mp3 2>/dev/null | wc -l)
echo "📊 Downloaded $AUDIO_FILE_COUNT audio files"

if [ $AUDIO_FILE_COUNT -gt 0 ]; then
    echo "✅ Audio generation completed successfully!"
    exit 0
else
    echo "❌ No audio files were downloaded"
    exit 1
fi
