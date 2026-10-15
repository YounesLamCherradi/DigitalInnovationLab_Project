const BUILDER_ASSET_PATTERN = /cdn\.builder\.io\/api\/v1\/image\/assets%2F[^%?]+%2F([a-f0-9]+)(?:\?|$)/i;

/**
 * Resolves legacy Builder CDN URLs to the recovered local copy.
 * Non-Builder URLs pass through unchanged.
 */
export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '/placeholder.svg';
  const assetId = url.match(BUILDER_ASSET_PATTERN)?.[1];
  return assetId ? `/images/recovered/${assetId}.webp` : url;
}
