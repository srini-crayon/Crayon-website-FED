/**
 * Get the public site URL for sharing links
 * Uses NEXT_PUBLIC_SITE_URL environment variable if set,
 * otherwise falls back to window.location.origin
 * 
 * This ensures shareable URLs work across devices and networks
 */
export function getPublicUrl(): string {
  // In server-side rendering, return empty string
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || '';
  }

  // Use environment variable if set (for production/deployment)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fall back to current origin (works in development)
  return window.location.origin;
}

/**
 * Get the full public wishlist URL
 * @param slug - The wishlist slug
 * @returns Full URL to the public wishlist page
 */
export function getPublicWishlistUrl(slug: string): string {
  const baseUrl = getPublicUrl();
  return `${baseUrl}/wishlists/public/${slug}`;
}

/**
 * Get the full wishlist URL (for private wishlists)
 * @param id - The wishlist ID
 * @returns Full URL to the wishlist page
 */
export function getWishlistUrl(id: string): string {
  const baseUrl = getPublicUrl();
  return `${baseUrl}/wishlists/${id}`;
}

