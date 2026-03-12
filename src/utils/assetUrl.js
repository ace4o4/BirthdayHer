/**
 * Resolves a public asset path against the Vite base URL.
 * Necessary when the app is deployed to a sub-path (e.g. GitHub Pages
 * at /BirthdayHer/) so that "/assets/foo.png" becomes
 * "/BirthdayHer/assets/foo.png" in production.
 *
 * Vite always provides BASE_URL with a trailing slash, so we strip
 * the leading slash from `path` before concatenating to avoid doubles.
 *
 * @param {string} path - Absolute-style path starting with "/"
 * @returns {string} URL with the correct base prefix
 */
export const assetUrl = (path) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
