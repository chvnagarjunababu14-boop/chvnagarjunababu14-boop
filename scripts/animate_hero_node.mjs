// Node fallback for Windows hosts without cairo: orbit planets into a GIF.
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
const FRAME_COUNT = 24;
const FRAME_DURATION_CS = 10; // 100ms
const WIDTH = 880;

const PLANET_RE = /(<g id="planet-(\d+)" data-orbit="1" transform="rotate\()(-?\d+(?:\.\d+)?)( [^"]*)(">)/g;
const SUN_HALO_RE = /(<g id="sun-halo" data-sun="1">\s*<circle r=")(\d+(?:\.\d+)?)(")/;

function animatedSvg(base, frameIndex) {
  const phase = (2 * Math.PI * frameIndex) / FRAME_COUNT;
  let svg = base.replace(PLANET_RE, (_, prefix, index, _angle, rest, suffix) => {
    const planetIndex = Number(index);
    const speed = 1.0 - planetIndex * 0.08;
    const angle = (planetIndex * 52 + (360 / FRAME_COUNT) * frameIndex * speed) % 360;
    return `${prefix}${angle.toFixed(3)}${rest}${suffix}`;
  });
  const halo = 70 + 3.5 * Math.sin(phase);
  svg = svg.replace(SUN_HALO_RE, `$1${halo.toFixed(3)}$3`);
  return svg;
}

function renderFrame(svg) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  const pngData = resvg.render();
  return { rgba: Buffer.from(pngData.pixels), width: pngData.width, height: pngData.height };
}

const original = readFileSync(SVG_PATH, 'utf8');
if (!original.includes('data-orbit="1"')) {
  throw new Error('Hero SVG is missing orbit planet markers for animation.');
}

const frames = [];
for (let i = 0; i < FRAME_COUNT; i++) frames.push(renderFrame(animatedSvg(original, i)));

const { width, height } = frames[0];
const gif = GIFEncoder();
for (const frame of frames) {
  const palette = quantize(frame.rgba, 256);
  const index = applyPalette(frame.rgba, palette);
  gif.writeFrame(index, width, height, { palette, delay: FRAME_DURATION_CS });
}
gif.finish();
mkdirSync(dirname(GIF_PATH), { recursive: true });
writeFileSync(GIF_PATH, Buffer.from(gif.bytes()));
console.log(`Animated solar hero created via node: assets/profile-universe.gif (${FRAME_COUNT} frames).`);
