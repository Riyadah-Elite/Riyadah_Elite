#!/usr/bin/env node

/**
 * Riyadah Elite - Automated GLB Optimization Pipeline
 *
 * Usage:
 *   node frontend/scripts/pipeline/optimize-glb.js <input_path> <output_path> [max_texture_res]
 *
 * Pipeline Steps:
 *   1. Verify input file existence.
 *   2. Preserve original (never overwrite in place).
 *   3. Execute headless optimization via Blender Python engine.
 *   4. Run Khronos glTF 2.0 conformance validator on generated binary.
 *   5. Compare before/after payloads and print metrics.
 *   6. Exit with code 1 if validation fails.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { validateGlb } = require('./validate-gltf');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node optimize-glb.js <input.glb> <output.glb> [max_texture_res]');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath = path.resolve(args[1]);
const maxRes = args[2] || '1024';

if (!fs.existsSync(inputPath)) {
  console.error(`[Error] Input file not found: ${inputPath}`);
  process.exit(1);
}

if (inputPath === outputPath) {
  console.error('[Error] Safety guard: input and output paths must not be identical.');
  process.exit(1);
}

const blenderExe = 'C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe';
if (!fs.existsSync(blenderExe)) {
  console.error(`[Error] Blender executable not found at: ${blenderExe}`);
  process.exit(1);
}

const blenderScript = path.resolve(__dirname, 'blender_optimize.py');

console.log('----------------------------------------------------');
console.log(`[Riyadah Elite Pipeline] Optimizing: ${path.basename(inputPath)}`);
console.log(`  Input: ${inputPath}`);
console.log(`  Output: ${outputPath}`);
console.log(`  Max Texture Dimension: ${maxRes}px`);
console.log('----------------------------------------------------');

const inputSize = fs.statSync(inputPath).size;

try {
  const cmd = `"${blenderExe}" -b -P "${blenderScript}" -- "${inputPath}" "${outputPath}" ${maxRes}`;
  execSync(cmd, { stdio: 'inherit' });
} catch (err) {
  console.error('[Error] Blender optimization command failed:', err.message);
  process.exit(1);
}

if (!fs.existsSync(outputPath)) {
  console.error(`[Error] Output file was not created: ${outputPath}`);
  process.exit(1);
}

// Validation Step
console.log('\n[Validation] Running glTF 2.0 Conformance Validation...');
const validation = validateGlb(outputPath);

if (!validation.valid) {
  console.error('[Validation Failed]:', validation.errors);
  process.exit(1);
}

const outputSize = fs.statSync(outputPath).size;
const reductionPct = (((inputSize - outputSize) / inputSize) * 100).toFixed(2);

console.log('\n================ Optimization Result ================');
console.log(`  Status:               PASSED (glTF 2.0 valid)`);
console.log(`  Original Size:        ${(inputSize / 1024 / 1024).toFixed(2)} MB (${inputSize.toLocaleString()} bytes)`);
console.log(`  Optimized Size:       ${(outputSize / 1024 / 1024).toFixed(2)} MB (${outputSize.toLocaleString()} bytes)`);
console.log(`  Net Reduction:        ${reductionPct}%`);
console.log(`  Meshes / Materials:   ${validation.info.meshes} / ${validation.info.materials}`);
console.log(`  Textures / Images:    ${validation.info.textures} / ${validation.info.images}`);
console.log('====================================================\n');
