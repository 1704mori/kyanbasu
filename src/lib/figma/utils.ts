export function RGBAToHexA(r: number, g: number, b: number, a: number) {
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  a = Math.round(a * 255);

  return "#" + r.toString(16) + g.toString(16) + b.toString(16) + a.toString(16);
}

export function RGBAToHex(r: number, g: number, b: number, a: number) {
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return "#" + r.toString(16) + g.toString(16) + b.toString(16)
}

export function normalizeRGBA(r: number, g: number, b: number, a: number) {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: a,
  };
}

export function RGBAtoHSL(r: number, g: number, b: number, a: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;

  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);

  l = +(l * 100).toFixed(1);

  return { h, s, l, a };
}