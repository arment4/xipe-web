import { describe, it, expect, beforeEach, vi } from 'vitest'

// Minimal localStorage stub (node has none).
const store = {}
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v) },
  removeItem: (k) => { delete store[k] },
}

const { api, getToken, setToken } = await import('./api.js')

const jsonResponse = (ok, body) => ({
  ok,
  headers: { get: () => 'application/json' },
  json: async () => body,
})

describe('api client', () => {
  beforeEach(() => {
    setToken(null)
    vi.restoreAllMocks()
  })

  it('stores and clears the token', () => {
    setToken('abc123')
    expect(getToken()).toBe('abc123')
    setToken(null)
    expect(getToken()).toBeNull()
  })

  it('attaches the Bearer token to requests', async () => {
    setToken('tok')
    const fetchMock = vi.fn(async () => jsonResponse(true, { ok: true }))
    globalThis.fetch = fetchMock

    await api.get('/me')

    const [, opts] = fetchMock.mock.calls[0]
    expect(opts.headers.Authorization).toBe('Bearer tok')
  })

  it('throws the server error message on failure', async () => {
    globalThis.fetch = vi.fn(async () => jsonResponse(false, { error: 'Saldo insuficiente' }))

    await expect(api.post('/me/send', { amount: 999 })).rejects.toThrow('Saldo insuficiente')
  })

  it('sends a JSON body on POST', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(true, {}))
    globalThis.fetch = fetchMock

    await api.post('/x', { a: 1 })

    const [, opts] = fetchMock.mock.calls[0]
    expect(opts.method).toBe('POST')
    expect(JSON.parse(opts.body)).toEqual({ a: 1 })
    expect(opts.headers['Content-Type']).toBe('application/json')
  })
})
