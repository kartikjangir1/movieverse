const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const apiFetch = (path, options) => fetch(`${apiBaseUrl}${path}`, options)
