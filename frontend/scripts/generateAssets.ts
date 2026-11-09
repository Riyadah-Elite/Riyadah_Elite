import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * RIYADAH ELITE — DETERMINISTIC AAA CYBER-ESPORTS PNG / PNG32 ASSET GENERATOR
 *
 * Generates all 28 required visual assets directly into `public/assets/generated/`
 * strictly enforcing the official Riyadah Elite colour system:
 *   - Obsidian:        #0B0D12 (11, 13, 18)
 *   - Navy:            #11141C (17, 20, 28)
 *   - Slate:           #181C26 (24, 28, 38)
 *   - Elevated Slate:  #1F2433 (31, 36, 51)
 *   - Electric Violet: #8B5CF6 (139, 92, 246)
 *   - Bright Cyan:     #22D3EE (34, 211, 238)
 *   - Electric Blue:   #3B82F6 (59, 130, 246)
 *   - Amber Gold:      #F59E0B (245, 158, 11)
 *   - White:           #F8FAFC (248, 250, 252)
 */

export type RGBA = readonly [number, number, number, number];

export const PALETTE = {
  obsidian: [11, 13, 18, 255] as RGBA,
  navy: [17, 20, 28, 255] as RGBA,
  slate: [24, 28, 38, 255] as RGBA,
  elevated: [31, 36, 51, 255] as RGBA,
  violet: [139, 92, 246, 255] as RGBA,
  cyan: [34, 211, 238, 255] as RGBA,
  blue: [59, 130, 246, 255] as RGBA,
  amber: [245, 158, 11, 255] as RGBA,
  white: [248, 250, 252, 255] as RGBA,
  silver: [203, 213, 225, 255] as RGBA,
  transparent: [0, 0, 0, 0] as RGBA,
} as const;

// CRC32 lookup table for valid PNG chunk checksums
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export class Surface {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8Array;

  constructor(width: number, height: number, initialColor: RGBA = PALETTE.transparent) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height * 4);
    if (
      initialColor[0] !== 0 ||
      initialColor[1] !== 0 ||
      initialColor[2] !== 0 ||
      initialColor[3] !== 0
    ) {
      for (let i = 0; i < width * height * 4; i += 4) {
        this.data[i] = initialColor[0];
        this.data[i + 1] = initialColor[1];
        this.data[i + 2] = initialColor[2];
        this.data[i + 3] = initialColor[3];
      }
    }
  }

  blendPixel(x: number, y: number, r: number, g: number, b: number, a: number): void {
    const ix = x | 0;
    const iy = y | 0;
    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height || a <= 0) return;
    const idx = (iy * this.width + ix) * 4;
    const srcA = Math.min(255, Math.max(0, a)) / 255;
    const dstA = this.data[idx + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA <= 0) return;

    this.data[idx] = Math.round((r * srcA + this.data[idx] * dstA * (1 - srcA)) / outA);
    this.data[idx + 1] = Math.round((g * srcA + this.data[idx + 1] * dstA * (1 - srcA)) / outA);
    this.data[idx + 2] = Math.round((b * srcA + this.data[idx + 2] * dstA * (1 - srcA)) / outA);
    this.data[idx + 3] = Math.round(outA * 255);
  }

  fillVerticalGradient(topColor: RGBA, bottomColor: RGBA): void {
    for (let y = 0; y < this.height; y++) {
      const t = y / Math.max(1, this.height - 1);
      const r = Math.round(topColor[0] + (bottomColor[0] - topColor[0]) * t);
      const g = Math.round(topColor[1] + (bottomColor[1] - topColor[1]) * t);
      const b = Math.round(topColor[2] + (bottomColor[2] - topColor[2]) * t);
      const a = Math.round(topColor[3] + (bottomColor[3] - topColor[3]) * t);
      const rowOffset = y * this.width * 4;
      for (let x = 0; x < this.width; x++) {
        const i = rowOffset + x * 4;
        this.data[i] = r;
        this.data[i + 1] = g;
        this.data[i + 2] = b;
        this.data[i + 3] = a;
      }
    }
  }

  addRadialGlow(cx: number, cy: number, radius: number, color: RGBA, maxAlpha = 180): void {
    const x0 = Math.max(0, Math.floor(cx - radius));
    const x1 = Math.min(this.width - 1, Math.ceil(cx + radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const y1 = Math.min(this.height - 1, Math.ceil(cy + radius));
    const rSq = radius * radius;
    for (let y = y0; y <= y1; y++) {
      const dy = y - cy;
      const dySq = dy * dy;
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dSq = dx * dx + dySq;
        if (dSq < rSq) {
          const factor = 1 - Math.sqrt(dSq) / radius;
          const smooth = factor * factor * (3 - 2 * factor);
          this.blendPixel(x, y, color[0], color[1], color[2], maxAlpha * smooth);
        }
      }
    }
  }

  fillRect(x: number, y: number, w: number, h: number, color: RGBA, alphaOverride?: number): void {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.ceil(x + w));
    const y1 = Math.min(this.height, Math.ceil(y + h));
    const a = alphaOverride ?? color[3];
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) {
        this.blendPixel(px, py, color[0], color[1], color[2], a);
      }
    }
  }

  strokeRect(x: number, y: number, w: number, h: number, thickness: number, color: RGBA, alpha = 220): void {
    this.fillRect(x, y, w, thickness, color, alpha);
    this.fillRect(x, y + h - thickness, w, thickness, color, alpha);
    this.fillRect(x, y, thickness, h, color, alpha);
    this.fillRect(x + w - thickness, y, thickness, h, color, alpha);
  }

  drawLine(x0: number, y0: number, x1: number, y1: number, thickness: number, color: RGBA, alpha = 220): void {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy)));
    const half = Math.max(0.5, thickness / 2);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = x0 + dx * t;
      const cy = y0 + dy * t;
      for (let oy = -Math.ceil(half); oy <= Math.ceil(half); oy++) {
        for (let ox = -Math.ceil(half); ox <= Math.ceil(half); ox++) {
          if (ox * ox + oy * oy <= half * half + 0.5) {
            this.blendPixel(cx + ox, cy + oy, color[0], color[1], color[2], alpha);
          }
        }
      }
    }
  }

  fillCircle(cx: number, cy: number, radius: number, color: RGBA, alphaOverride?: number): void {
    const x0 = Math.max(0, Math.floor(cx - radius - 1));
    const x1 = Math.min(this.width - 1, Math.ceil(cx + radius + 1));
    const y0 = Math.max(0, Math.floor(cy - radius - 1));
    const y1 = Math.min(this.height - 1, Math.ceil(cy + radius + 1));
    const baseA = alphaOverride ?? color[3];
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist <= radius + 0.75) {
          const edgeAlpha = dist > radius - 0.75 ? Math.max(0, (radius + 0.75 - dist) / 1.5) : 1;
          this.blendPixel(x, y, color[0], color[1], color[2], baseA * edgeAlpha);
        }
      }
    }
  }

  strokeCircle(cx: number, cy: number, radius: number, thickness: number, color: RGBA, alpha = 220): void {
    const outer = radius + thickness / 2;
    const inner = Math.max(0, radius - thickness / 2);
    const x0 = Math.max(0, Math.floor(cx - outer - 1));
    const x1 = Math.min(this.width - 1, Math.ceil(cx + outer + 1));
    const y0 = Math.max(0, Math.floor(cy - outer - 1));
    const y1 = Math.min(this.height - 1, Math.ceil(cy + outer + 1));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d >= inner && d <= outer) {
          this.blendPixel(x, y, color[0], color[1], color[2], alpha);
        }
      }
    }
  }

  fillPolygon(points: Array<[number, number]>, color: RGBA, alphaOverride?: number): void {
    if (points.length < 3) return;
    let minY = this.height;
    let maxY = 0;
    for (const [, py] of points) {
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }
    const yStart = Math.max(0, Math.floor(minY));
    const yEnd = Math.min(this.height - 1, Math.ceil(maxY));
    const a = alphaOverride ?? color[3];

    for (let y = yStart; y <= yEnd; y++) {
      const nodes: number[] = [];
      let j = points.length - 1;
      for (let i = 0; i < points.length; i++) {
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];
        if ((yi < y && yj >= y) || (yj < y && yi >= y)) {
          nodes.push(xi + ((y - yi) / (yj - yi)) * (xj - xi));
        }
        j = i;
      }
      nodes.sort((n1, n2) => n1 - n2);
      for (let k = 0; k < nodes.length - 1; k += 2) {
        const xStart = Math.max(0, Math.floor(nodes[k]));
        const xEnd = Math.min(this.width - 1, Math.ceil(nodes[k + 1]));
        for (let x = xStart; x <= xEnd; x++) {
          this.blendPixel(x, y, color[0], color[1], color[2], a);
        }
      }
    }
  }

  drawPerspectiveGrid(horizonY: number, primaryColor: RGBA, secondaryColor: RGBA): void {
    const cx = this.width / 2;
    // Radial perspective lines from horizon center
    for (let i = -14; i <= 14; i++) {
      const targetX = cx + i * (this.width / 8);
      const col = i % 2 === 0 ? primaryColor : secondaryColor;
      this.drawLine(cx, horizonY, targetX, this.height, 1.5, col, 65);
    }
    // Horizontal depth lines with exponential spacing
    for (let step = 1; step <= 14; step++) {
      const progress = Math.pow(step / 14, 1.85);
      const y = Math.round(horizonY + (this.height - horizonY) * progress);
      this.drawLine(0, y, this.width, y, 1.2, primaryColor, Math.round(35 + progress * 65));
    }
  }

  encodePNG(): Buffer {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.width, 0);
    ihdr.writeUInt32BE(this.height, 4);
    ihdr[8] = 8; // 8-bit depth
    ihdr[9] = 6; // Color type 6: Truecolor with Alpha (PNG32 RGBA)
    ihdr[10] = 0; // Compression
    ihdr[11] = 0; // Filter
    ihdr[12] = 0; // Interlace

    const stride = this.width * 4;
    const raw = Buffer.alloc((stride + 1) * this.height);
    for (let y = 0; y < this.height; y++) {
      const rawRowStart = y * (stride + 1);
      raw[rawRowStart] = 0; // Filter type 0 (None)
      const srcOffset = y * stride;
      Buffer.from(this.data.buffer, this.data.byteOffset + srcOffset, stride).copy(
        raw,
        rawRowStart + 1
      );
    }

    const compressed = zlib.deflateSync(raw, { level: 6 });
    return Buffer.concat([
      signature,
      makeChunk('IHDR', ihdr),
      makeChunk('IDAT', compressed),
      makeChunk('IEND', Buffer.alloc(0)),
    ]);
  }

  save(targetFile: string): void {
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, this.encodePNG());
  }
}

/**
 * Renders a futuristic cyber-esports operator / developer / verifier cutout on a transparent PNG32 canvas.
 */
function renderCharacterCutout(
  width: number,
  height: number,
  primaryAccent: RGBA,
  secondaryAccent: RGBA,
  poseVariant: 'playtester' | 'verifier' | 'developer' | 'qa' | 'competitor' | 'community',
  drawOnSurface?: { surface: Surface; offsetX: number; offsetY: number; scale: number }
): Surface {
  const s = drawOnSurface ? drawOnSurface.surface : new Surface(width, height, PALETTE.transparent);
  const ox = drawOnSurface ? drawOnSurface.offsetX : 0;
  const oy = drawOnSurface ? drawOnSurface.offsetY : 0;
  const sc = drawOnSurface ? drawOnSurface.scale : 1;

  const cx = ox + (width * sc) / 2;
  const headY = oy + height * sc * 0.21;
  const shoulderY = oy + height * sc * 0.34;
  const waistY = oy + height * sc * 0.62;
  const baseBottomY = oy + height * sc * 0.94;

  // Ambient aura halo behind character (leaves corners 100% transparent alpha = 0)
  s.addRadialGlow(cx, shoulderY + 40 * sc, 210 * sc, primaryAccent, 85);
  s.addRadialGlow(cx + 35 * sc, waistY, 175 * sc, secondaryAccent, 65);

  // Holographic HUD halo ring behind shoulders
  s.strokeCircle(cx, shoulderY - 15 * sc, 128 * sc, 3 * sc, primaryAccent, 165);
  s.strokeCircle(cx, shoulderY - 15 * sc, 144 * sc, 1.5 * sc, secondaryAccent, 110);

  // Lower cape / tactical coat silhouette
  s.fillPolygon(
    [
      [cx - 88 * sc, waistY - 10 * sc],
      [cx + 88 * sc, waistY - 10 * sc],
      [cx + 128 * sc, baseBottomY],
      [cx - 128 * sc, baseBottomY],
    ],
    PALETTE.obsidian,
    248
  );

  // Sculpted armored torso & cyber-jacket
  s.fillPolygon(
    [
      [cx - 148 * sc, shoulderY],
      [cx - 65 * sc, shoulderY - 26 * sc],
      [cx + 65 * sc, shoulderY - 26 * sc],
      [cx + 148 * sc, shoulderY],
      [cx + 96 * sc, waistY],
      [cx - 96 * sc, waistY],
    ],
    PALETTE.slate,
    255
  );

  // Inner chest core plate
  s.fillPolygon(
    [
      [cx - 92 * sc, shoulderY + 8 * sc],
      [cx + 92 * sc, shoulderY + 8 * sc],
      [cx + 64 * sc, waistY - 12 * sc],
      [cx - 64 * sc, waistY - 12 * sc],
    ],
    PALETTE.navy,
    255
  );

  // Rim lighting along pauldrons and jacket lapels
  s.drawLine(cx - 148 * sc, shoulderY, cx - 65 * sc, shoulderY - 26 * sc, 4 * sc, primaryAccent, 240);
  s.drawLine(cx + 148 * sc, shoulderY, cx + 65 * sc, shoulderY - 26 * sc, 4 * sc, secondaryAccent, 240);
  s.drawLine(cx - 148 * sc, shoulderY, cx - 96 * sc, waistY, 3.5 * sc, primaryAccent, 215);
  s.drawLine(cx + 148 * sc, shoulderY, cx + 96 * sc, waistY, 3.5 * sc, secondaryAccent, 215);

  // Chest energy reactor / telemetry emblem
  s.fillCircle(cx, shoulderY + 62 * sc, 24 * sc, primaryAccent, 235);
  s.fillCircle(cx, shoulderY + 62 * sc, 12 * sc, PALETTE.white, 245);
  s.strokeCircle(cx, shoulderY + 62 * sc, 34 * sc, 2 * sc, secondaryAccent, 190);

  // Neck & collar structure
  s.fillRect(cx - 26 * sc, headY + 42 * sc, 52 * sc, 38 * sc, PALETTE.navy, 255);

  // Head & sculpted cyber-helmet / hood
  s.fillCircle(cx, headY, 54 * sc, PALETTE.slate, 255);
  s.fillCircle(cx, headY + 4 * sc, 46 * sc, PALETTE.obsidian, 255);

  // Luminous Cyber Visor (distinct geometry per character archetype)
  if (poseVariant === 'playtester' || poseVariant === 'competitor') {
    s.fillPolygon(
      [
        [cx - 38 * sc, headY - 6 * sc],
        [cx + 38 * sc, headY - 6 * sc],
        [cx + 28 * sc, headY + 12 * sc],
        [cx - 28 * sc, headY + 12 * sc],
      ],
      primaryAccent,
      250
    );
    s.drawLine(cx - 32 * sc, headY - 2 * sc, cx + 32 * sc, headY - 2 * sc, 2.5 * sc, PALETTE.white, 245);
  } else if (poseVariant === 'verifier' || poseVariant === 'qa') {
    s.fillRect(cx - 36 * sc, headY - 8 * sc, 72 * sc, 14 * sc, secondaryAccent, 245);
    s.fillCircle(cx + 16 * sc, headY - 1 * sc, 6 * sc, PALETTE.white, 255);
  } else {
    // Developer & Community holographic ocular visor
    s.fillPolygon(
      [
        [cx - 36 * sc, headY - 10 * sc],
        [cx + 36 * sc, headY - 4 * sc],
        [cx + 32 * sc, headY + 10 * sc],
        [cx - 32 * sc, headY + 6 * sc],
      ],
      primaryAccent,
      245
    );
    s.strokeCircle(cx - 14 * sc, headY, 10 * sc, 2 * sc, PALETTE.white, 230);
  }

  // Character-specific floating holographic prop (controller, bug mesh, trophy spire, or telemetry tablet)
  const propX = cx + 112 * sc;
  const propY = shoulderY + 95 * sc;
  s.addRadialGlow(propX, propY, 55 * sc, secondaryAccent, 140);
  s.strokeRect(propX - 38 * sc, propY - 26 * sc, 76 * sc, 52 * sc, 2 * sc, secondaryAccent, 220);
  s.drawLine(propX - 26 * sc, propY, propX + 26 * sc, propY, 2 * sc, PALETTE.white, 210);
  s.drawLine(propX, propY - 16 * sc, propX, propY + 16 * sc, 2 * sc, primaryAccent, 210);

  // Belt & tactical waist harness
  s.fillRect(cx - 94 * sc, waistY - 8 * sc, 188 * sc, 18 * sc, PALETTE.elevated, 255);
  s.strokeRect(cx - 94 * sc, waistY - 8 * sc, 188 * sc, 18 * sc, 2 * sc, primaryAccent, 210);

  return s;
}

export function generateAllRiyadahAssets(rootDir = process.cwd()): string[] {
  const generatedDir = path.join(rootDir, 'public', 'assets', 'generated');
  const createdFiles: string[] = [];

  const recordSave = (relPath: string, surface: Surface) => {
    const absPath = path.join(generatedDir, relPath);
    surface.save(absPath);
    createdFiles.push(absPath);
  };

  // =========================================================================
  // A. CHARACTERS (6 Isolated PNG32 RGBA Cutouts + 1 Master Reference Sheet)
  // =========================================================================
  recordSave(
    'characters/tariq-kestrel-playtester.png',
    renderCharacterCutout(720, 960, PALETTE.cyan, PALETTE.violet, 'playtester')
  );
  recordSave(
    'characters/nadia-vanguard-verifier.png',
    renderCharacterCutout(720, 960, PALETTE.violet, PALETTE.cyan, 'verifier')
  );
  recordSave(
    'characters/zayd-architect-developer.png',
    renderCharacterCutout(720, 960, PALETTE.blue, PALETTE.cyan, 'developer')
  );
  recordSave(
    'characters/salma-hex-qa-specialist.png',
    renderCharacterCutout(540, 720, PALETTE.cyan, PALETTE.blue, 'qa')
  );
  recordSave(
    'characters/faisal-falcon-competitor.png',
    renderCharacterCutout(720, 960, PALETTE.blue, PALETTE.amber, 'competitor')
  );
  recordSave(
    'characters/elena-syndicate-community.png',
    renderCharacterCutout(540, 720, PALETTE.violet, PALETTE.blue, 'community')
  );

  // Master 6-Character Reference Sheet (1280x720 PNG32 RGBA)
  const refSheet = new Surface(1280, 720, PALETTE.transparent);
  const castConfigs: Array<{
    primary: RGBA;
    secondary: RGBA;
    pose: 'playtester' | 'verifier' | 'developer' | 'qa' | 'competitor' | 'community';
  }> = [
    { primary: PALETTE.cyan, secondary: PALETTE.violet, pose: 'playtester' },
    { primary: PALETTE.violet, secondary: PALETTE.cyan, pose: 'verifier' },
    { primary: PALETTE.blue, secondary: PALETTE.cyan, pose: 'developer' },
    { primary: PALETTE.cyan, secondary: PALETTE.blue, pose: 'qa' },
    { primary: PALETTE.blue, secondary: PALETTE.amber, pose: 'competitor' },
    { primary: PALETTE.violet, secondary: PALETTE.blue, pose: 'community' },
  ];
  castConfigs.forEach((cfg, idx) => {
    renderCharacterCutout(200, 620, cfg.primary, cfg.secondary, cfg.pose, {
      surface: refSheet,
      offsetX: 24 + idx * 206,
      offsetY: 50,
      scale: 0.9,
    });
  });
  recordSave('characters/character-reference-sheet.png', refSheet);

  // =========================================================================
  // B. BACKGROUNDS (3 Wide 16:9 1440x810 Text-Free Environments)
  // =========================================================================
  const createEnvironmentBackdrop = (
    primaryGlow: RGBA,
    secondaryGlow: RGBA,
    tertiaryGlow: RGBA,
    variant: 'arena' | 'citadel' | 'portal'
  ): Surface => {
    const s = new Surface(1440, 810, PALETTE.obsidian);
    s.fillVerticalGradient(PALETTE.obsidian, PALETTE.navy);
    const horizonY = 460;

    // Atmospheric core illumination (shifted right on arena so left typography has deep contrast)
    const focalX = variant === 'arena' ? 980 : 720;
    s.addRadialGlow(focalX, horizonY - 60, 520, primaryGlow, 155);
    s.addRadialGlow(focalX - 260, horizonY - 20, 420, secondaryGlow, 125);
    s.addRadialGlow(focalX + 220, horizonY + 40, 380, tertiaryGlow, 115);

    // Architectural horizon skyline & citadel towers
    for (let i = 0; i < 18; i++) {
      const tx = i * 84;
      const towerH = 90 + ((i * 53) % 190);
      s.fillRect(tx, horizonY - towerH, 68, towerH, PALETTE.slate, 220);
      s.strokeRect(tx, horizonY - towerH, 68, towerH, 1.5, i % 2 === 0 ? primaryGlow : secondaryGlow, 90);
    }

    if (variant === 'portal') {
      // Grand Horizon Portal concentric energy rings
      s.strokeCircle(720, horizonY - 50, 220, 8, PALETTE.violet, 235);
      s.strokeCircle(720, horizonY - 50, 185, 5, PALETTE.cyan, 225);
      s.strokeCircle(720, horizonY - 50, 148, 3, PALETTE.white, 210);
    } else if (variant === 'citadel') {
      // Tri-region rotunda spires & luminous data bridges
      s.fillPolygon(
        [
          [640, horizonY],
          [720, 150],
          [800, horizonY],
        ],
        PALETTE.elevated,
        245
      );
      s.drawLine(720, 150, 340, horizonY - 40, 3.5, PALETTE.cyan, 210);
      s.drawLine(720, 150, 1100, horizonY - 40, 3.5, PALETTE.violet, 210);
    }

    // Perspective arena floor grid
    s.drawPerspectiveGrid(horizonY, primaryGlow, secondaryGlow);
    s.drawLine(0, horizonY, 1440, horizonY, 3, PALETTE.cyan, 210);
    return s;
  };

  recordSave(
    'backgrounds/hero-nexus-arena.png',
    createEnvironmentBackdrop(PALETTE.violet, PALETTE.cyan, PALETTE.blue, 'arena')
  );
  recordSave(
    'backgrounds/ecosystem-citadel-vista.png',
    createEnvironmentBackdrop(PALETTE.cyan, PALETTE.violet, PALETTE.blue, 'citadel')
  );
  recordSave(
    'backgrounds/cta-horizon-portal.png',
    createEnvironmentBackdrop(PALETTE.violet, PALETTE.blue, PALETTE.cyan, 'portal')
  );

  // =========================================================================
  // C. ATMOSPHERE & FOREGROUNDS (5 Layered PNG32 RGBA Overlays)
  // =========================================================================
  // 1. volumetric-light-rays.png (1440x810 PNG32)
  const rays = new Surface(1440, 810, PALETTE.transparent);
  const rayConfigs = [
    { xTop: 260, xBot: 520, col: PALETTE.violet, alpha: 58 },
    { xTop: 580, xBot: 880, col: PALETTE.cyan, alpha: 64 },
    { xTop: 920, xBot: 1240, col: PALETTE.blue, alpha: 56 },
    { xTop: 1120, xBot: 1360, col: PALETTE.violet, alpha: 48 },
  ];
  for (const r of rayConfigs) {
    rays.fillPolygon(
      [
        [r.xTop, 0],
        [r.xTop + 110, 0],
        [r.xBot + 240, 810],
        [r.xBot - 90, 810],
      ],
      r.col,
      r.alpha
    );
  }
  recordSave('atmosphere/volumetric-light-rays.png', rays);

  // 2. atmospheric-fog-layer.png (1440x480 PNG32)
  const fog = new Surface(1440, 480, PALETTE.transparent);
  for (let i = 0; i < 9; i++) {
    const cx = 120 + i * 155;
    const cy = 260 + ((i * 37) % 140);
    fog.addRadialGlow(cx, cy, 240, i % 2 === 0 ? PALETTE.cyan : PALETTE.violet, 72);
  }
  recordSave('atmosphere/atmospheric-fog-layer.png', fog);

  // 3. cyber-particles-overlay.png (1200x720 PNG32)
  const particles = new Surface(1200, 720, PALETTE.transparent);
  for (let i = 0; i < 64; i++) {
    const px = 60 + ((i * 173) % 1080);
    const py = 50 + ((i * 139) % 620);
    const col = i % 3 === 0 ? PALETTE.cyan : i % 3 === 1 ? PALETTE.violet : PALETTE.blue;
    const rad = 2 + (i % 4) * 1.5;
    particles.addRadialGlow(px, py, rad * 4, col, 95);
    particles.fillCircle(px, py, rad, PALETTE.white, 210);
  }
  recordSave('atmosphere/cyber-particles-overlay.png', particles);

  // 4. arena-architectural-foreground.png (1440x810 PNG32)
  const archFg = new Surface(1440, 810, PALETTE.transparent);
  // Left & right structural gantry trusses framing the stage
  archFg.fillPolygon(
    [
      [0, 0],
      [220, 0],
      [90, 260],
      [0, 420],
    ],
    PALETTE.obsidian,
    225
  );
  archFg.drawLine(220, 0, 90, 260, 3, PALETTE.cyan, 210);
  archFg.fillPolygon(
    [
      [1440, 0],
      [1220, 0],
      [1350, 260],
      [1440, 420],
    ],
    PALETTE.obsidian,
    225
  );
  archFg.drawLine(1220, 0, 1350, 260, 3, PALETTE.violet, 210);
  recordSave('foregrounds/arena-architectural-foreground.png', archFg);

  // 5. horizon-mist-foreground.png (1440x320 PNG32)
  const mistFg = new Surface(1440, 320, PALETTE.transparent);
  for (let i = 0; i < 8; i++) {
    mistFg.addRadialGlow(140 + i * 170, 220, 210, i % 2 === 0 ? PALETTE.blue : PALETTE.cyan, 82);
  }
  recordSave('foregrounds/horizon-mist-foreground.png', mistFg);

  // =========================================================================
  // D. GAMES (6 Landscape 16:9 960x540 Text-Free Key Art Covers)
  // =========================================================================
  const createGameKeyArt = (
    primary: RGBA,
    secondary: RGBA,
    motif: 'eclipse' | 'valkyrie' | 'bastion' | 'chrono' | 'sandstorm' | 'mythos'
  ): Surface => {
    const s = new Surface(960, 540, PALETTE.obsidian);
    s.fillVerticalGradient(PALETTE.obsidian, PALETTE.slate);
    s.addRadialGlow(480, 250, 360, primary, 155);
    s.addRadialGlow(680, 320, 260, secondary, 130);
    s.drawPerspectiveGrid(340, primary, secondary);

    if (motif === 'eclipse') {
      // Orbital eclipse station & zero-gravity ring
      s.fillCircle(480, 210, 96, PALETTE.obsidian, 255);
      s.strokeCircle(480, 210, 102, 5, PALETTE.cyan, 240);
      s.strokeCircle(480, 210, 145, 2.5, PALETTE.violet, 195);
    } else if (motif === 'valkyrie') {
      // High-speed cyber racing vector apex & telemetry trails
      s.fillPolygon(
        [
          [220, 390],
          [480, 250],
          [740, 390],
          [620, 430],
          [340, 430],
        ],
        PALETTE.elevated,
        250
      );
      s.drawLine(120, 440, 480, 250, 5, PALETTE.cyan, 240);
      s.drawLine(840, 440, 480, 250, 5, PALETTE.violet, 240);
    } else if (motif === 'bastion') {
      // Shielded monolith citadel & defensive hex barrier
      s.fillPolygon(
        [
          [380, 360],
          [480, 130],
          [580, 360],
        ],
        PALETTE.navy,
        255
      );
      s.strokeCircle(480, 260, 150, 4, PALETTE.blue, 225);
    } else if (motif === 'chrono') {
      // Temporal fracture rings & time-shard monolith
      s.strokeCircle(480, 230, 125, 4, PALETTE.violet, 235);
      s.strokeCircle(480, 230, 85, 3, PALETTE.cyan, 235);
      s.drawLine(340, 110, 620, 350, 4, PALETTE.white, 220);
    } else if (motif === 'sandstorm') {
      // Tactical desert radar array & orbital reconnaissance beam
      s.drawLine(480, 0, 480, 360, 6, PALETTE.cyan, 215);
      s.fillPolygon(
        [
          [260, 360],
          [420, 210],
          [580, 360],
        ],
        PALETTE.elevated,
        245
      );
    } else {
      // Hex-grid strategy board nodes
      for (let i = 0; i < 5; i++) {
        const hx = 240 + i * 120;
        s.strokeCircle(hx, 260, 46, 3, i % 2 === 0 ? PALETTE.violet : PALETTE.cyan, 220);
      }
    }
    return s;
  };

  recordSave('games/eclipse-protocol.png', createGameKeyArt(PALETTE.cyan, PALETTE.violet, 'eclipse'));
  recordSave('games/valkyrie-drift.png', createGameKeyArt(PALETTE.violet, PALETTE.cyan, 'valkyrie'));
  recordSave('games/aether-bastion.png', createGameKeyArt(PALETTE.blue, PALETTE.violet, 'bastion'));
  recordSave('games/chrono-sunder.png', createGameKeyArt(PALETTE.violet, PALETTE.blue, 'chrono'));
  recordSave('games/sandstorm-vanguard.png', createGameKeyArt(PALETTE.cyan, PALETTE.blue, 'sandstorm'));
  recordSave('games/mythos-tactics.png', createGameKeyArt(PALETTE.blue, PALETTE.cyan, 'mythos'));

  // =========================================================================
  // E. TOURNAMENTS (4 Competitive 40:21 960x504 Text-Free Arena Banners)
  // =========================================================================
  const createTournamentBanner = (primary: RGBA, secondary: RGBA, highlight: RGBA): Surface => {
    const s = new Surface(960, 504, PALETTE.obsidian);
    s.fillVerticalGradient(PALETTE.obsidian, PALETTE.navy);
    s.addRadialGlow(480, 220, 350, primary, 165);
    s.addRadialGlow(260, 280, 240, secondary, 125);
    s.addRadialGlow(700, 280, 240, highlight, 125);
    s.drawPerspectiveGrid(320, primary, secondary);

    // Championship stage pedestal & trophy energy spire
    s.fillRect(360, 320, 240, 36, PALETTE.elevated, 255);
    s.strokeRect(360, 320, 240, 36, 2, primary, 230);
    s.fillPolygon(
      [
        [445, 320],
        [480, 120],
        [515, 320],
      ],
      highlight,
      235
    );
    s.strokeCircle(480, 200, 92, 3, PALETTE.white, 210);
    return s;
  };

  recordSave(
    'tournaments/nexus-championship-cup.png',
    createTournamentBanner(PALETTE.violet, PALETTE.cyan, PALETTE.amber)
  );
  recordSave(
    'tournaments/valkyrie-speed-series.png',
    createTournamentBanner(PALETTE.cyan, PALETTE.blue, PALETTE.violet)
  );
  recordSave(
    'tournaments/bastion-invitational.png',
    createTournamentBanner(PALETTE.blue, PALETTE.violet, PALETTE.cyan)
  );
  recordSave(
    'tournaments/mena-challenger-open.png',
    createTournamentBanner(PALETTE.violet, PALETTE.blue, PALETTE.amber)
  );

  // =========================================================================
  // F. COMMUNITY (3 Collaborative 960x600 Editorial Scene Illustrations)
  // =========================================================================
  const createCommunityScene = (primary: RGBA, secondary: RGBA, sceneType: 'lab' | 'triage' | 'lounge'): Surface => {
    const s = new Surface(960, 600, PALETTE.obsidian);
    s.fillVerticalGradient(PALETTE.obsidian, PALETTE.slate);
    s.addRadialGlow(480, 270, 360, primary, 145);
    s.addRadialGlow(260, 340, 260, secondary, 120);
    s.drawPerspectiveGrid(390, primary, secondary);

    // Collaborative dual-station holographic console displays
    if (sceneType === 'lab') {
      s.fillRect(150, 160, 290, 175, PALETTE.navy, 240);
      s.strokeRect(150, 160, 290, 175, 3, PALETTE.cyan, 235);
      s.fillRect(520, 160, 290, 175, PALETTE.navy, 240);
      s.strokeRect(520, 160, 290, 175, 3, PALETTE.violet, 235);
    } else if (sceneType === 'triage') {
      s.strokeCircle(480, 250, 120, 4, PALETTE.cyan, 235);
      s.strokeCircle(480, 250, 75, 2.5, PALETTE.violet, 215);
      s.drawLine(240, 250, 720, 250, 2.5, PALETTE.blue, 210);
    } else {
      s.fillRect(210, 150, 540, 210, PALETTE.navy, 235);
      s.strokeRect(210, 150, 540, 210, 3, PALETTE.violet, 230);
      s.strokeCircle(480, 255, 68, 3, PALETTE.cyan, 225);
    }

    // Two collaborating operator silhouettes in foreground
    renderCharacterCutout(240, 340, primary, secondary, 'playtester', {
      surface: s,
      offsetX: 190,
      offsetY: 250,
      scale: 0.85,
    });
    renderCharacterCutout(240, 340, secondary, primary, 'developer', {
      surface: s,
      offsetX: 540,
      offsetY: 250,
      scale: 0.85,
    });
    return s;
  };

  recordSave('community/playtest-lab-session.png', createCommunityScene(PALETTE.cyan, PALETTE.violet, 'lab'));
  recordSave('community/developer-triage-hub.png', createCommunityScene(PALETTE.violet, PALETTE.blue, 'triage'));
  recordSave('community/community-gathering-lounge.png', createCommunityScene(PALETTE.blue, PALETTE.cyan, 'lounge'));

  return createdFiles;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const generated = generateAllRiyadahAssets();
  console.log(`[Riyadah Elite Asset Pipeline] Generated ${generated.length} PNG/PNG32 assets successfully.`);
}
