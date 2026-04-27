function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1"
}

export function apiUrl(path) {
  if (typeof window === "undefined") {
    return `http://127.0.0.1:8000${path}`
  }

  const { protocol, hostname, origin } = window.location

  if (isLocalHost(hostname)) {
    return `${protocol}//${hostname}:8000${path}`
  }

  return `${origin}${path}`
}
