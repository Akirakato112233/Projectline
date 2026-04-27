const apiHost = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1"

export function apiUrl(path) {
  return `http://${apiHost}:8000${path}`
}
