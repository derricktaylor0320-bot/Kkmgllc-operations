export type SpherePoint = { x: number; y: number; z: number };

export type ProjectedSpherePoint = SpherePoint & {
  left: number;
  top: number;
  scale: number;
};

const DIGIT_THREE_SAMPLES = 240;

/** Parametric stroke for a founders-style numeral "3" in normalized [-1, 1] space. */
function pointOnDigitThree(t: number): { x: number; y: number } {
  const cx = 0.14;
  const r = 0.4;

  if (t < 0.1) {
    const u = t / 0.1;
    return { x: -0.44 + u * 0.28, y: 0.8 - u * 0.1 };
  }
  if (t < 0.5) {
    const u = (t - 0.1) / 0.4;
    const angle = Math.PI * 0.94 - u * Math.PI * 1.1;
    return { x: cx + r * Math.cos(angle), y: 0.34 + r * 0.7 * Math.sin(angle) };
  }
  if (t < 0.58) {
    const u = (t - 0.5) / 0.08;
    return { x: 0.5 - u * 0.3, y: 0.02 - u * 0.05 };
  }

  const u = (t - 0.58) / 0.42;
  const angle = Math.PI * 0.9 - u * Math.PI * 1.12;
  return { x: cx + r * Math.cos(angle), y: -0.34 + r * 0.7 * Math.sin(angle) };
}

function sampleDigitThreePath(n: number) {
  const dense: { x: number; y: number }[] = [];
  for (let i = 0; i < DIGIT_THREE_SAMPLES; i++) {
    dense.push(pointOnDigitThree(i / (DIGIT_THREE_SAMPLES - 1)));
  }

  const lengths = [0];
  for (let i = 1; i < dense.length; i++) {
    const dx = dense[i].x - dense[i - 1].x;
    const dy = dense[i].y - dense[i - 1].y;
    lengths.push(lengths[i - 1] + Math.hypot(dx, dy));
  }

  const total = lengths[lengths.length - 1];
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < n; i++) {
    const target = ((i + 0.5) / n) * total;
    let segment = 1;
    while (segment < lengths.length && lengths[segment] < target) {
      segment++;
    }

    const start = lengths[segment - 1];
    const end = lengths[segment];
    const span = end - start || 1;
    const t = (target - start) / span;
    const from = dense[segment - 1];
    const to = dense[segment];

    points.push({
      x: from.x + t * (to.x - from.x),
      y: from.y + t * (to.y - from.y),
    });
  }

  return points;
}

/**
 * Distribute `n` points along a founders "3" path with tubular depth so rotation
 * keeps the same sphere-like parallax as the original hub wheel.
 */
export function digitThreeSphere(n: number): SpherePoint[] {
  const flat = sampleDigitThreePath(n);

  return flat.map((point, index) => {
    const tubeAngle = (index / Math.max(n, 1)) * Math.PI * 2;
    const tubeRadius = 0.24;
    const x = point.x;
    const y = point.y;
    const z = tubeRadius * Math.sin(tubeAngle) + 0.12 * Math.cos(tubeAngle * 2);
    const length = Math.hypot(x, y, z) || 1;
    return { x: x / length, y: y / length, z: z / length };
  });
}

export function projectSpherePoint(
  point: SpherePoint,
  angle: number,
  options: { radius?: number; perspective?: number; tilt?: number } = {},
): ProjectedSpherePoint {
  const { radius = 190, perspective = 700, tilt = -0.35 } = options;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);

  let x = point.x * cosA - point.z * sinA;
  let z = point.x * sinA + point.z * cosA;
  let y = point.y;
  const yTilted = y * cosT - z * sinT;
  const zTilted = y * sinT + z * cosT;
  y = yTilted;
  z = zTilted;

  const scale = perspective / (perspective - z * radius);
  return {
    ...point,
    x,
    y,
    z,
    left: x * radius * scale,
    top: y * radius * scale,
    scale,
  };
}

/** SVG path for the decorative founders "3" guide (viewBox -1 -1 2 2). */
export const DIGIT_THREE_GUIDE_PATH =
  "M -0.44 0.8 C -0.44 0.8 0.52 0.82 0.52 0.48 C 0.52 0.18 -0.12 0.14 0.36 0 C -0.08 -0.14 0.54 -0.24 0.5 -0.56 C 0.46 -0.84 -0.36 -0.78 -0.36 -0.78";
