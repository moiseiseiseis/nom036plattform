"use client";

export function CampoEnlace({ path }: { path: string }) {
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  return (
    <input
      readOnly
      value={url}
      onFocus={(e) => e.currentTarget.select()}
      className="w-full rounded-lg border border-black/15 px-3 py-2 font-mono text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
    />
  );
}
