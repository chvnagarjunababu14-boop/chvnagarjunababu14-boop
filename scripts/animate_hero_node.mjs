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
const FRAME_COUNT = 36;
const FRAME_DURATION_CS = 8; // 80ms
const WIDTH = 880;

const PLANET_RE = /<g id="planet-(\d+)" data-orbit="1" data-cx="([^"]+)" data-cy="([^"]+)" data-rx="([^"]+)" data-ry="([^"]+)" data-angle="([^"]+)" transform="translate\([^"]+\)">/g;
const SUN_HALO_RE = /(<g id="sun-halo" data-sun="1">\s*<circle r=")(\d+(?:\.\d+)?)(")/;

function animatedSvg(base, frameIndex) {
  const phase = (2 * Math.PI * frameIndex) / FRAME_COUNT;
  let svg = base.replace(PLANET_RE, (full, index, cx, cy, rx, ry, startAngle) => {
    const planetIndex = Number(index);
    const speed = 1.0 - planetIndex * 0.09;
    const angle = (Number(startAngle) + (360 / FRAME_COUNT) * frameIndex * speed) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = Number(cx) + Number(rx) * Math.cos(rad);
    const y = Number(cy) + Number(ry) * Math.sin(rad);
    return `<g id="planet-${index}" data-orbit="1" data-cx="${cx}" data-cy="${cy}" data-rx="${rx}" data-ry="${ry}" data-angle="${angle.toFixed(3)}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">`;
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
if (!original.includes('data-rx=')) {
  throw new Error('Hero SVG is missing elliptical orbit markers for animation.');
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
console.log(`Animated elliptical solar hero created via node: assets/profile-universe.gif (${FRAME_COUNT} frames).`);
