import { useEffect } from 'react';

const FRAME_COUNT = 11;
const DURATION_MS = 880; // ~11 frames at 80ms each

// Logo palette stops: orange #F97316 → gold #D4A017 → crimson #DC2626 → back
const PALETTE = [
  [249, 115, 22],   // orange
  [212, 160, 23],   // gold
  [220, 38,  38],   // crimson
];

/**
 * Generates one cursor frame as a PNG data URL.
 * The arrow cycles through a violet → amber glow.
 */
function buildFrame(i, total) {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const t = (i / total) * PALETTE.length;
  const idx0 = Math.floor(t) % PALETTE.length;
  const idx1 = (idx0 + 1) % PALETTE.length;
  const mix  = t - Math.floor(t);
  const [r0,g0,b0] = PALETTE[idx0];
  const [r1,g1,b1] = PALETTE[idx1];
  const r = Math.round(r0 + (r1 - r0) * mix);
  const g = Math.round(g0 + (g1 - g0) * mix);
  const b = Math.round(b0 + (b1 - b0) * mix);

  const glowR = 4 + Math.sin((i / total) * Math.PI * 2) * 3;
  const glowA = 0.22 + Math.sin((i / total) * Math.PI * 2) * 0.18;
  const col = `rgb(${r},${g},${b})`;

  ctx.clearRect(0, 0, 32, 32);

  // Radial glow halo behind tip
  const halo = ctx.createRadialGradient(5, 3, 0, 5, 3, glowR + 9);
  halo.addColorStop(0, `rgba(${r},${g},${b},${glowA + 0.2})`);
  halo.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(5, 3, glowR + 9, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  // Arrow path (standard pointer, hotspot = 4,2)
  const arrow = () => {
    ctx.beginPath();
    ctx.moveTo(4, 1);
    ctx.lineTo(4, 20);
    ctx.lineTo(8,  15);
    ctx.lineTo(12, 24);
    ctx.lineTo(14.5, 22.5);
    ctx.lineTo(10.5, 13.5);
    ctx.lineTo(17,  13.5);
    ctx.closePath();
  };

  // Glowing shadow
  ctx.save();
  ctx.shadowColor = col;
  ctx.shadowBlur = glowR;
  arrow();
  ctx.fillStyle = col;
  ctx.fill();
  ctx.restore();

  // White outline
  arrow();
  ctx.strokeStyle = 'rgba(255,255,255,0.88)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

/**
 * Implements the ani-cursor CSS pattern:
 *   @keyframes { N% { cursor: url(frame), auto; } }
 *   selector { animation: name Xms step-end infinite; }
 */
function injectCursorAnimation(frames) {
  const name = `sh-cur-${Math.random().toString(36).slice(2, 7)}`;
  const step = 100 / frames.length;

  const kf = frames
    .map((url, i) => `${(i * step).toFixed(3)}% { cursor: url("${url}") 4 1, auto; }`)
    .join('\n      ');

  const selectors = [
    'body',
    'a',
    'button',
    '[role="button"]',
    '.post-card',
    '.dash-item',
    '.upvote-btn',
    'label',
    'input',
    'textarea',
    '.navbar-link',
    '.btn',
  ].join(', ');

  const css = `
    @keyframes ${name} {
      ${kf}
    }
    ${selectors} {
      cursor: url("${frames[0]}") 4 1, auto !important;
      animation: ${name} ${DURATION_MS}ms step-end infinite !important;
    }
  `;

  const el = document.createElement('style');
  el.id = 'sh-cursor-style';
  el.textContent = css;
  document.head.appendChild(el);
  return el;
}

export default function CursorEffect() {
  useEffect(() => {
    const frames = Array.from({ length: FRAME_COUNT }, (_, i) =>
      buildFrame(i, FRAME_COUNT)
    );
    const styleEl = injectCursorAnimation(frames);
    return () => styleEl.remove();
  }, []);

  return null;
}
