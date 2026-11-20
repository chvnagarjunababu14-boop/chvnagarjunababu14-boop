// HD vibrant elliptical orbits — crisp native resolution, rich palette, calm pacing.
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
// ~6.7s calm loop at native SVG width — sharp + vibrant.
const FRAME_COUNT = 48;
const FRAME_DURATION_CS = 14; // 140ms
const WIDTH = 880;
const COLORS = 192;

const PLANET_RE = /<g id="planet-(\d+)" data-orbit="1" data-cx="([^"]+)" data-cy="([^"]+)" data-rx="([^"]+)" data-ry="([^"]+)" data-angle="([^"]+)"(?: data-speed="([^"]+)")? transform="translate\([^"]+\)">/g;
const MOON_RE = /<circle class="moon" data-moon="1" data-mr="([^"]+)" data-mang="([^"]+)" cx="[^"]*" cy="[^"]*" r="([^"]*)"([^>]*)>/g;
const COMET_RE = /<g id="comet-(\d+)" data-comet="1" data-y="([^"]+)" data-x0="([^"]+)" data-span="([^"]+)" data-phase="([^"]+)" transform="translate\([^"]+\)">/g;
const SUN_HALO_RE = /(<g id="sun-halo" data-sun="1">\s*<circle r=")(\d+(?:\.\d+)?)(")/;

function animatedSvg(base, frameIndex) {
  const phase = (2 * Math.PI * frameIndex) / FRAME_COUNT;
  let svg = base.replace(PLANET_RE, (_full, index, cx, cy, rx, ry, startAngle, speedAttr) => {
    const speed = speedAttr ? Number(speedAttr) : 1;
    const angle = (Number(startAngle) + (360 / FRAME_COUNT) * frameIndex * speed) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = Number(cx) + Number(rx) * Math.cos(rad);
    const y = Number(cy) + Number(ry) * Math.sin(rad);
    const speedOut = speedAttr || String(speed);
    return `<g id="planet-${index}" data-orbit="1" data-cx="${cx}" data-cy="${cy}" data-rx="${rx}" data-ry="${ry}" data-angle="${angle.toFixed(3)}" data-speed="${speedOut}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">`;
  });

  svg = svg.replace(MOON_RE, (_full, mr, mang, r, rest) => {
    const angle = (Number(mang) + (360 / FRAME_COUNT) * frameIndex * 0.5) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = Number(mr) * Math.cos(rad);
    const y = Number(mr) * Math.sin(rad);
    return `<circle class="moon" data-moon="1" data-mr="${mr}" data-mang="${Number(mang)}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"${rest}>`;
  });

  svg = svg.replace(COMET_RE, (_full, index, y, x0, span, cphase) => {
    const t = (frameIndex / FRAME_COUNT + Number(cphase)) % 1;
    const eased = t * t * (3 - 2 * t);
    const x = Number(x0) + Number(span) * eased;
    return `<g id="comet-${index}" data-comet="1" data-y="${y}" data-x0="${x0}" data-span="${span}" data-phase="${cphase}" transform="translate(${x.toFixed(2)} ${Number(y).toFixed(2)})">`;
  });

  const halo = 78 + 2.4 * Math.sin(phase);
  svg = svg.replace(SUN_HALO_RE, `$1${halo.toFixed(3)}$3`);
  return svg;
}

function renderFrame(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { loadSystemFonts: true },
  });
  const pngData = resvg.render();
  return { rgba: Buffer.from(pngData.pixels), width: pngData.width, height: pngData.height };
}

function samplePixels(frames, stride = 11) {
  const samples = [];
  for (const frame of frames) {
    const { rgba } = frame;
    for (let i = 0; i < rgba.length; i += 4 * stride) {
      samples.push(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]);
    }
  }
  return Uint8Array.from(samples);
}

const original = readFileSync(SVG_PATH, 'utf8');
if (!original.includes('data-rx=')) {
  throw new Error('Hero SVG is missing elliptical orbit markers for animation.');
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
const kb = Math.round(bytes.length / 1024);
console.log(`HD solar hero GIF: assets/profile-universe.gif (${width}x${height}, ${FRAME_COUNT} frames @ ${FRAME_DURATION_CS * 10}ms, ${COLORS} colors, ${kb} KB).`);
