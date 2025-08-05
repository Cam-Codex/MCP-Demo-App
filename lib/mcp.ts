import { z } from 'zod'

export class MCPError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

const QuestionSchema = z.object({ questionId: z.string(), text: z.string() })
export const RelevantQuestionsSchema = z.object({ questions: z.array(QuestionSchema) })

export const AnswerSchema = z.object({
  answerId: z.string(),
  data: z.array(z.record(z.string(), z.any())),
})
export type Answer = z.infer<typeof AnswerSchema>

export const LiveboardSchema = z.object({ liveboardId: z.string() })

export const DatasourceSchema = z.object({ id: z.string(), name: z.string() })
export type Datasource = z.infer<typeof DatasourceSchema>

async function handle<T>(resp: Response, schema: z.ZodSchema<T>): Promise<T> {
  if (!resp.ok) {
    throw new MCPError(`MCP error ${resp.status}`, resp.status)
  }
  const json = await resp.json()
  return schema.parse(json)
}

export async function getRelevantQuestions({
  baseUrl,
  query,
  datasources = [],
  fetchImpl = fetch,
}: {
  baseUrl: string
  query: string
  datasources?: string[]
  fetchImpl?: typeof fetch
}): Promise<z.infer<typeof QuestionSchema>[]> {
  const resp = await fetchImpl(`${baseUrl}/getRelevantQuestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, datasources }),
  })
  const data = await handle(resp, RelevantQuestionsSchema)
  return data.questions
}

export async function getAnswer({
  baseUrl,
  questionId,
  fetchImpl = fetch,
}: {
  baseUrl: string
  questionId: string
  fetchImpl?: typeof fetch
}): Promise<Answer> {
  const resp = await fetchImpl(`${baseUrl}/getAnswer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId }),
  })
  return handle(resp, AnswerSchema)
}

export async function createLiveboard({
  baseUrl,
  answerIds,
  fetchImpl = fetch,
}: {
  baseUrl: string
  answerIds: string[]
  fetchImpl?: typeof fetch
}): Promise<z.infer<typeof LiveboardSchema>> {
  const resp = await fetchImpl(`${baseUrl}/createLiveboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answerIds }),
  })
  return handle(resp, LiveboardSchema)
}

export async function listDatasources({
  baseUrl,
  fetchImpl = fetch,
}: {
  baseUrl: string
  fetchImpl?: typeof fetch
}): Promise<Datasource[]> {
  const resp = await fetchImpl(`${baseUrl}/datasources`, {
    method: 'GET',
  })
  return handle(resp, z.object({ datasources: z.array(DatasourceSchema) })).then(d => d.datasources)
}
