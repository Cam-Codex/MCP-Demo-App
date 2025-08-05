import { describe, it, expect } from 'vitest'
import { refineQuery } from '../lib/openai'

describe('refineQuery', () => {
  it('returns polished query', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { role: 'assistant', content: 'polished' } }],
      }),
    }) as any
    const result = await refineQuery('raw question', mockFetch)
    expect(result).toBe('polished')
  })
})
