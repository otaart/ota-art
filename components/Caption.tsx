import type { WorkView } from '@/lib/content';

/** A size or its inches never breaks in the middle (Sophia, 22 Nov 2026) */
function NoWrapDims({ text }: { text: string }) {
  const parts = text.split(/((?:Ø\s*)?\d+(?:[.,]\d+)?\s*(?:×\s*\d+(?:[.,]\d+)?\s*)?cm|\([^)]*\))/g);
  return <>{parts.map((p, i) => (i % 2 ? <span key={i} className="nw">{p}</span> : p))}</>;
}

/** Medium and size on one line; framed works one paragraph with the framed size */
export function CaptionLine({ w }: { w: WorkView }) {
  return w.framed
    ? <span className="fpara">{w.medium}, <NoWrapDims text={w.dim} />, <NoWrapDims text={w.framed} /></span>
    : <span>{w.medium}, {w.dim}</span>;
}

export function MetaBlock({ w }: { w: WorkView }) {
  return (
    <div className="dmeta">
      {w.framed
        ? <div className="m1 fpara">{w.medium}, <NoWrapDims text={w.dim} />, <NoWrapDims text={w.framed} /></div>
        : <div className="m1">{w.medium}, {w.dim}</div>}
      {w.note ? <div className="m3">{w.note}</div> : null}
    </div>
  );
}
