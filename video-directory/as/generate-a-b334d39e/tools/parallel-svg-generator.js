#!/usr/bin/env node

/**
 * Simplified SVG Generator for Codex Integration
 * Uses a single powerful codex command to generate all assets at once
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

/**
 * Execute single codex command to generate all SVG assets
 * @param {string} cwd - Working directory
 * @returns {Promise<string>} - Generated content
 */
async function generateAllSVGsWithCodex(cwd) {
  return new Promise((resolve, reject) => {
    const codex = spawn('codex', [
      'exec', 
      '--dangerously-bypass-approvals-and-sandbox', 
      '--sandbox=workspace-write', 
      '--json',
      'Generate ALL SVG assets needed for this story in one go. Create background.svg, character.svg, character-2.svg, object.svg, vehicle.svg, and any other assets the story requires. Each file should be a complete, well-designed SVG that fits the story\'s visual style and narrative. Save each as a separate file in the assets/ directory.'
    ], {
      cwd,
      stdio: 'pipe'
    });
    
    let stdout = '';
    let stderr = '';
    
    codex.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    codex.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    codex.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Codex failed: ${stderr}`));
      }
    });
    
    codex.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Generate all SVG assets with single codex command
 * @param {string} outputDir - Directory to save the SVG files
 * @param {string} cwd - Working directory for codex
 * @returns {Promise<Object>} - Results of SVG generation operation
 */
async function generateAllSVGs(outputDir = './assets', cwd = process.cwd()) {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  
  try {
    console.log('🎨 Generating ALL SVG assets with single codex command...');
    await generateAllSVGsWithCodex(cwd);
    
    // Check what files were created
    const files = await fs.readdir(outputDir);
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    
    console.log(`✅ Generated ${svgFiles.length} SVG files:`, svgFiles);
      
      return {
        success: true,
      files: svgFiles,
      count: svgFiles.length
      };
    } catch (error) {
    console.error('❌ Failed to generate SVG assets:', error.message);
      return {
        success: false,
        error: error.message,
      files: [],
      count: 0
    };
  }
}

// Export functions for use in other modules
module.exports = {
  generateAllSVGs,
  generateAllSVGsWithCodex
};

// CLI usage
if (require.main === module) {
  generateAllSVGs()
    .then(results => {
      console.log('Simplified SVG Generation Results:');
      console.log(`Success: ${results.success}`);
      console.log(`Files generated: ${results.count}`);
      console.log('Files:', results.files);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}