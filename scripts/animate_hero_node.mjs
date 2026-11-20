// Gentle leaf sway for Cedar & Stone nature hero (HD GIF).
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
const FRAME_COUNT = 32;
const FRAME_DURATION_CS = 10;
const WIDTH = 1200;
const COLORS = 192;

const LEAF_RE = /<g data-leaf="([^"]+)" data-px="([^"]+)" data-py="([^"]+)" transform="rotate\([^"]+\)">/g;
const MOTION = {
  sage: { amp: 2.4, phase: 0 },
  copper: { amp: -2.9, phase: 0.35 },
  gold: { amp: 2.1, phase: 1.1 },
  moss: { amp: -2.5, phase: 1.7 },
};

function animatedSvg(base, frameIndex) {
  const t = (2 * Math.PI * frameIndex) / FRAME_COUNT;
  return base.replace(LEAF_RE, (_full, name, px, py) => {
    const m = MOTION[name] || { amp: 2, phase: 0 };
    const angle = m.amp * Math.sin(t + m.phase);
    return `<g data-leaf="${name}" data-px="${px}" data-py="${py}" transform="rotate(${angle.toFixed(3)} ${px} ${py})">`;
  });
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
if (!original.includes('data-leaf=')) throw new Error('Hero SVG is missing data-leaf markers for nature animation.');

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
console.log(`Nature leaf GIF: assets/profile-universe.gif (${width}x${height}, ${FRAME_COUNT} frames @ ${FRAME_DURATION_CS * 10}ms, ${COLORS} colors, ${Math.round(bytes.length / 1024)} KB).`);
