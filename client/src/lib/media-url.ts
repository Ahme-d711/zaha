const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3131/api";

const getBackendOrigin = () => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "http://localhost:3131";
  }
};

export const resolveMediaUrl = (path?: string | null) => {
  if (!path) return "";

  // Keep already absolute/data/blob URLs unchanged.
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendOrigin()}${normalizedPath}`;
};
