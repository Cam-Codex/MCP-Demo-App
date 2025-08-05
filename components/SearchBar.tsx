'use client'

import React, { useEffect, useState } from 'react'
import { refineQuery } from '../lib/openai'
import {
  getRelevantQuestions,
  getAnswer,
  createLiveboard,
  listDatasources,
  type Answer,
  type Datasource,
} from '../lib/mcp'
import TSAnswerTable from './TSAnswerTable'
import TSLiveboardEmbed from './TSLiveboardEmbed'

const SYSTEM_PROMPT = 'You are an analytics demo assistant and help polish user questions.'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [liveboardId, setLiveboardId] = useState<string | null>(null)
  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [selectedDatasources, setSelectedDatasources] = useState<string[]>([])
  const [tsUrl, setTsUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('TS_URL') : null
    if (!stored) {
      setShowModal(true)
    } else {
      setTsUrl(stored)
    }
  }, [])

  useEffect(() => {
    if (!tsUrl) return
    listDatasources({ baseUrl: tsUrl })
      .then(setDatasources)
      .catch(() => {})
  }, [tsUrl])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!tsUrl) return
    const polished = await refineQuery(query)
    const rel = await getRelevantQuestions({ baseUrl: tsUrl, query: polished, datasources: selectedDatasources })
    const first = rel[0]
    if (!first) return
    const ans = await getAnswer({ baseUrl: tsUrl, questionId: first.questionId })
    setAnswer(ans)
    setLiveboardId(null)
  }

  async function handleCreateLiveboard() {
    if (!tsUrl || !answer) return
    const lb = await createLiveboard({ baseUrl: tsUrl, answerIds: [answer.answerId] })
    setLiveboardId(lb.liveboardId)
  }

  function saveTsUrl() {
    if (tsUrl) {
      localStorage.setItem('TS_URL', tsUrl)
      setShowModal(false)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask a question"
        />
        <button className="px-4 py-2 rounded bg-blue-600 text-white" type="submit">
          Ask
        </button>
      </form>
      {datasources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {datasources.map(ds => (
            <label key={ds.id} className="text-sm">
              <input
                type="checkbox"
                checked={selectedDatasources.includes(ds.id)}
                onChange={e =>
                  setSelectedDatasources(s =>
                    e.target.checked ? [...s, ds.id] : s.filter(id => id !== ds.id)
                  )
                }
              />{' '}
              {ds.name}
            </label>
          ))}
        </div>
      )}
      {answer && (
        <div className="mt-6">
          <TSAnswerTable answer={answer} />
          <button onClick={handleCreateLiveboard} className="mt-4 px-4 py-2 rounded bg-green-600 text-white">
            Create Liveboard
          </button>
        </div>
      )}
      {liveboardId && (
        <div className="mt-6">
          <TSLiveboardEmbed liveboardId={liveboardId} />
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
            <h2 className="text-lg font-bold">Connect to ThoughtSpot</h2>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="https://acme.thoughtspot.cloud"
              value={tsUrl ?? ''}
              onChange={e => setTsUrl(e.target.value)}
            />
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={saveTsUrl}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
