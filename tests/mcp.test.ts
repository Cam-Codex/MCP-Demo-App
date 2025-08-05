import { describe, it, expect } from 'vitest'
import {
  getRelevantQuestions,
  getAnswer,
  createLiveboard,
  listDatasources,
  MCPError,
} from '../lib/mcp'

describe('mcp client', () => {
  it('parses relevant questions', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({ questions: [{ questionId: '1', text: 'Q1' }] }),
    }) as any
    const res = await getRelevantQuestions({ baseUrl: 'http://ts', query: 'hi', fetchImpl: mockFetch })
    expect(res[0].questionId).toBe('1')
  })

  it('parses answer', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({ answerId: 'a1', data: [{ col: 'val' }] }),
    }) as any
    const res = await getAnswer({ baseUrl: 'http://ts', questionId: '1', fetchImpl: mockFetch })
    expect(res.answerId).toBe('a1')
  })

  it('parses liveboard create', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({ liveboardId: 'lb1' }),
    }) as any
    const res = await createLiveboard({ baseUrl: 'http://ts', answerIds: ['a1'], fetchImpl: mockFetch })
    expect(res.liveboardId).toBe('lb1')
  })

  it('parses datasources list', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({ datasources: [{ id: '1', name: 'Sales' }] }),
    }) as any
    const res = await listDatasources({ baseUrl: 'http://ts', fetchImpl: mockFetch })
    expect(res[0].name).toBe('Sales')
  })

  it('throws MCPError on failure', async () => {
    const mockFetch = async () => ({ ok: false, status: 401, json: async () => ({}) }) as any
    await expect(
      getRelevantQuestions({ baseUrl: 'http://ts', query: 'hi', fetchImpl: mockFetch })
    ).rejects.toBeInstanceOf(MCPError)
  })
})
