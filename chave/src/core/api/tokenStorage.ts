const TOKEN_KEY = 'chave:token'
const memory = new Map<string, string>()

function nativeStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null
    return localStorage
  } catch {
    return null
  }
}

export function getAuthToken() {
  const native = nativeStorage()
  if (native) return native.getItem(TOKEN_KEY)
  return memory.get(TOKEN_KEY) ?? null
}

export function setAuthToken(token: string) {
  const native = nativeStorage()
  if (native) {
    native.setItem(TOKEN_KEY, token)
    return
  }
  memory.set(TOKEN_KEY, token)
}

export function clearAuthToken() {
  const native = nativeStorage()
  if (native) {
    native.removeItem(TOKEN_KEY)
    return
  }
  memory.delete(TOKEN_KEY)
}
