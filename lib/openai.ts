import { z } from 'zod'

const MessageSchema = z.object({ role: z.string(), content: z.string() })
export const ChatCompletionSchema = z.object({
  choices: z.array(
    z.object({
      message: MessageSchema,
    })
  ),
})

export async function refineQuery(query: string, fetchImpl: typeof fetch = fetch): Promise<string> {
  const resp = await fetchImpl('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.1,
      messages: [
        { role: 'system', content: 'You are an analytics demo assistant …' },
        { role: 'user', content: query },
      ],
    }),
  })
  if (!resp.ok) throw new Error(`OpenAI error ${resp.status}`)
  const json = await resp.json()
  const parsed = ChatCompletionSchema.parse(json)
  return parsed.choices[0]?.message.content.trim() ?? query
}
