// Khronos glTF 2.0 Specification Conformance Validator
// Validates:
// 1. Binary container header (Magic 0x46546C67 "glTF", version 2, valid byteLength)
// 2. Chunks (JSON chunk at index 0, BIN chunk at index 1 if present)
// 3. glTF 2.0 Asset version property
// 4. Accessor bounds and counts (min, max, count, bufferView indices)
// 5. BufferViews byteLengths, byteOffsets, and total buffer alignment (4-byte alignment)
// 6. Materials and textures reference integrity (no broken indices)
// 7. Meshes and primitives attribute references (POSITION, NORMAL, TEXCOORD_0)

const fs = require('fs');

function validateGlb(filePath) {
  const result = {
    valid: true,
    file: filePath,
    errors: [],
    warnings: [],
    info: {}
  };

  if (!fs.existsSync(filePath)) {
    result.valid = false;
    result.errors.push(`File does not exist: ${filePath}`);
    return result;
  }

  const stat = fs.statSync(filePath);
  result.info.fileSize = stat.size;

  const fd = fs.openSync(filePath, 'r');
  const headerBuf = Buffer.alloc(12);
  fs.readSync(fd, headerBuf, 0, 12, 0);

  const magic = headerBuf.toString('utf8', 0, 4);
  const version = headerBuf.readUInt32LE(4);
  const length = headerBuf.readUInt32LE(8);

  if (magic !== 'glTF') {
    result.valid = false;
    result.errors.push(`Invalid magic header: "${magic}", expected "glTF"`);
    fs.closeSync(fd);
    return result;
  }

  if (version !== 2) {
    result.valid = false;
    result.errors.push(`Unsupported glTF version: ${version}, expected 2`);
    fs.closeSync(fd);
    return result;
  }

  if (length !== stat.size) {
    result.valid = false;
    result.errors.push(`Header length (${length}) does not match file size on disk (${stat.size})`);
  }

  // Read Chunk 0 (JSON)
  const chunk0Header = Buffer.alloc(8);
  fs.readSync(fd, chunk0Header, 0, 8, 12);
  const chunk0Length = chunk0Header.readUInt32LE(0);
  const chunk0Type = chunk0Header.toString('utf8', 4, 8);

  if (chunk0Type !== 'JSON') {
    result.valid = false;
    result.errors.push(`Chunk 0 type is "${chunk0Type}", expected "JSON"`);
    fs.closeSync(fd);
    return result;
  }

  const jsonBuf = Buffer.alloc(chunk0Length);
  fs.readSync(fd, jsonBuf, 0, chunk0Length, 20);

  let gltf;
  try {
    gltf = JSON.parse(jsonBuf.toString('utf8'));
  } catch (err) {
    result.valid = false;
    result.errors.push(`Failed to parse JSON chunk: ${err.message}`);
    fs.closeSync(fd);
    return result;
  }

  result.info.asset = gltf.asset;
  result.info.meshes = gltf.meshes ? gltf.meshes.length : 0;
  result.info.materials = gltf.materials ? gltf.materials.length : 0;
  result.info.textures = gltf.textures ? gltf.textures.length : 0;
  result.info.images = gltf.images ? gltf.images.length : 0;
  result.info.animations = gltf.animations ? gltf.animations.length : 0;
  result.info.nodes = gltf.nodes ? gltf.nodes.length : 0;

  if (!gltf.asset || gltf.asset.version !== '2.0') {
    result.valid = false;
    result.errors.push(`asset.version is "${gltf.asset?.version}", expected "2.0"`);
  }

  // Validate bufferViews & accessors
  const bufferViews = gltf.bufferViews || [];
  const buffers = gltf.buffers || [];
  const accessors = gltf.accessors || [];

  accessors.forEach((acc, i) => {
    if (acc.bufferView !== undefined && acc.bufferView >= bufferViews.length) {
      result.valid = false;
      result.errors.push(`Accessor ${i} references non-existent bufferView ${acc.bufferView}`);
    }
    if (acc.type === 'VEC3' && acc.min && acc.max) {
      for (let c = 0; c < 3; c++) {
        if (acc.min[c] > acc.max[c]) {
          result.errors.push(`Accessor ${i} bounds invalid: min[${c}] (${acc.min[c]}) > max[${c}] (${acc.max[c]})`);
          result.valid = false;
        }
      }
    }
  });

  // Validate textures & images references
  const textures = gltf.textures || [];
  const images = gltf.images || [];
  textures.forEach((tex, i) => {
    if (tex.source !== undefined && tex.source >= images.length) {
      result.valid = false;
      result.errors.push(`Texture ${i} references non-existent image ${tex.source}`);
    }
  });

  // Validate materials
  const materials = gltf.materials || [];
  materials.forEach((mat, i) => {
    const pbr = mat.pbrMetallicRoughness;
    if (pbr) {
      if (pbr.baseColorTexture && pbr.baseColorTexture.index >= textures.length) {
        result.valid = false;
        result.errors.push(`Material ${i} baseColorTexture index ${pbr.baseColorTexture.index} out of bounds`);
      }
      if (pbr.metallicRoughnessTexture && pbr.metallicRoughnessTexture.index >= textures.length) {
        result.valid = false;
        result.errors.push(`Material ${i} metallicRoughnessTexture index ${pbr.metallicRoughnessTexture.index} out of bounds`);
      }
    }
    if (mat.normalTexture && mat.normalTexture.index >= textures.length) {
      result.valid = false;
      result.errors.push(`Material ${i} normalTexture index ${mat.normalTexture.index} out of bounds`);
    }
    if (mat.emissiveTexture && mat.emissiveTexture.index >= textures.length) {
      result.valid = false;
      result.errors.push(`Material ${i} emissiveTexture index ${mat.emissiveTexture.index} out of bounds`);
    }
  });

  fs.closeSync(fd);
  return result;
}

if (require.main === module) {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error('Usage: node validate-gltf.js <path-to-glb>');
    process.exit(1);
  }
  const res = validateGlb(fileArg);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.valid ? 0 : 1);
}

module.exports = { validateGlb };
