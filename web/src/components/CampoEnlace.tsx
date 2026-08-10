"use client";

export function CampoEnlace({ path }: { path: string }) {
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  return (
    <input
      readOnly
      value={url}
      onFocus={(e) => e.currentTarget.select()}
      className="w-full rounded-md border border-black/15 px-3 py-2 font-mono text-sm"
    />
  );
}
