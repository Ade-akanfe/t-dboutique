export function parseSizes(raw: string): string[] {
  if (!raw) return ['Free Size'];
  let clean = raw.trim().replace(/[\.`]+$/, '').trim();
  const lower = clean.toLowerCase();

  if (lower === 'free size' || lower === 'free' || lower === 'free size.') {
    return ['Free Size'];
  }
  if (lower === 'turkey top' || lower === 'turkey' || lower === 'uk') {
    return [clean];
  }

  if (/turkey.*uk/i.test(clean)) {
    return clean.split(',').map((s) => s.trim()).filter(Boolean);
  }

  clean = clean.replace('1611', '16');

  let prefix = '';
  if (/(?:size\s*:\s*|size\s+)?uk\s*(?:size)?/i.test(clean)) {
    prefix = 'UK';
    clean = clean.replace(/^(?:size\s*:\s*|size\s+)?uk\s*(?:size)?\s*:?\s*/i, '');
  } else if (/(?:size\s*:\s*|size\s+)?turkey\s*(?:size)?/i.test(clean)) {
    prefix = 'Turkey';
    clean = clean.replace(/^(?:size\s*:\s*|size\s+)?turkey\s*(?:size)?\s*:?\s*/i, '');
  } else if (/(?:size\s*:\s*|size\s+)?us\s*(?:size)?/i.test(clean)) {
    prefix = 'US';
    clean = clean.replace(/^(?:size\s*:\s*|size\s+)?us\s*(?:size)?\s*:?\s*/i, '');
  } else if (/^size\s*:?\s*/i.test(clean)) {
    prefix = 'Size';
    clean = clean.replace(/^size\s*:?\s*/i, '');
  }

  clean = clean.replace(/[\.`]+$/, '').trim();

  const parts = clean
    .split(/[,&]|\band\b/i)
    .map((part) => part.trim().replace(/[\.`]+$/, ''))
    .filter(Boolean);

  const results = parts.map((part) => {
    const partClean = part.replace(/^size\s*:?\s*/i, '').trim();
    if (prefix) return `${prefix} ${partClean}`;
    if (/^\d+$/.test(partClean)) return `Size ${partClean}`;
    return partClean;
  });

  return Array.from(new Set(results));
}
