/**
 * Resolves media/image/video URLs for both local and production deployments.
 * If the URL is already absolute (starts with http/https), it returns it as is.
 * If it's a relative path starting with /uploads or /public, it prepends the backend base URL.
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  // Get configured backend URL
  const envApiUrl = import.meta.env.VITE_API_URL;
  const backendBase = envApiUrl 
    ? envApiUrl.replace(/\/$/, '')
    : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : (typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : ''));

  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};

