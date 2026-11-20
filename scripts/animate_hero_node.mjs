// Clear vertical falling leaves + gentle grove sway for Cedar & Stone.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import gifenc from 'gifenc';

const { GIFEncoder, quantize, applyPalette } = gifenc;
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SVG_PATH = join(ROOT, 'assets', 'profile-universe.svg');
const GIF_PATH = join(ROOT, 'assets', 'profile-universe.gif');
const FRAME_COUNT = 48;
const FRAME_DURATION_CS = 9; // 90ms — smooth ~4.3s loop
const WIDTH = 1200;
const COLORS = 192;
const FALL_TRAVEL = 560;

const SWAY_RE = /<g data-leaf="([^"]+)" data-px="([^"]+)" data-py="([^"]+)" transform="rotate\([^"]+\)">/g;
const FALL_RE = /<g data-fall="1" data-x0="([^"]+)" data-y0="([^"]+)" data-rot0="([^"]+)" data-scale="([^"]+)" data-phase="([^"]+)" data-drift="([^"]+)" data-spin="([^"]+)" opacity="[^"]*" transform="[^"]*">/g;

const SWAY = {
  sage: { amp: 2.4, phase: 0 },
  copper: { amp: -2.9, phase: 0.35 },
  gold: { amp: 2.1, phase: 1.1 },
  moss: { amp: -2.5, phase: 1.7 },
};

function fallOpacity(p) {
  // Fade in/out so wraparound never pops — reads as continuous falling.
  if (p < 0.12) return Math.max(0, p / 0.12);
  if (p > 0.88) return Math.max(0, (1 - p) / 0.12);
  return 1;
}

function animatedSvg(base, frameIndex) {
  const t = (2 * Math.PI * frameIndex) / FRAME_COUNT;
  let svg = base.replace(SWAY_RE, (_full, name, px, py) => {
    const m = SWAY[name] || { amp: 2, phase: 0 };
    const angle = m.amp * Math.sin(t + m.phase);
    return `<g data-leaf="${name}" data-px="${px}" data-py="${py}" transform="rotate(${angle.toFixed(3)} ${px} ${py})">`;
  });

  svg = svg.replace(FALL_RE, (_full, x0, y0, rot0, scale, phase, drift, spin) => {
    const p = (frameIndex / FRAME_COUNT + Number(phase)) % 1;
    // Mostly vertical fall; tiny side sway only.
    const x = Number(x0) + Math.sin(p * Math.PI * 2) * Number(drift);
    const y = Number(y0) + p * FALL_TRAVEL;
    const rot = Number(rot0) + p * Number(spin);
    const op = (0.9 * fallOpacity(p)).toFixed(3);
    return `<g data-fall="1" data-x0="${x0}" data-y0="${y0}" data-rot0="${rot0}" data-scale="${scale}" data-phase="${phase}" data-drift="${drift}" data-spin="${spin}" opacity="${op}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${scale})">`;
  });

  return svg;
}

function renderFrame(svg) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH }, font: { loadSystemFonts: true } });
  const png = resvg.render();
  return { rgba: Buffer.from(png.pixels), width: png.width, height: png.height };
}

function samplePixels(frames, stride = 13) {
  const samples = [];
  for (const frame of frames) {
    const { rgba } = frame;
    for (let i = 0; i < rgba.length; i += 4 * stride) samples.push(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]);
  }
  return Uint8Array.from(samples);
}

const original = readFileSync(SVG_PATH, 'utf8');
if (!original.includes('data-leaf=') || !original.includes('data-fall=')) {
  throw new Error('Hero SVG is missing leaf sway or falling-leaf markers.');
}

const frames = [];
for (let i = 0; i < FRAME_COUNT; i++) frames.push(renderFrame(animatedSvg(original, i)));
const { width, height } = frames[0];
const palette = quantize(samplePixels(frames), COLORS, { format: 'rgba4444' });
const gif = GIFEncoder();
for (const frame of frames) {
  const index = applyPalette(frame.rgba, palette, { format: 'rgba4444' });
  gif.writeFrame(index, width, height, { palette, delay: FRAME_DURATION_CS });
}
gif.finish();
mkdirSync(dirname(GIF_PATH), { recursive: true });
const bytes = Buffer.from(gif.bytes());
writeFileSync(GIF_PATH, bytes);
console.log(`Falling-leaf GIF: assets/profile-universe.gif (${width}x${height}, ${FRAME_COUNT} frames @ ${FRAME_DURATION_CS * 10}ms, ${Math.round(bytes.length / 1024)} KB).`);
