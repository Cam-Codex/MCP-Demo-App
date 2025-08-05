'use client'

import React from 'react'
import { Answer } from '../lib/mcp'

export default function TSAnswerTable({ answer }: { answer: Answer }) {
  if (answer.data.length === 0) return <p>No data</p>
  const columns = Object.keys(answer.data[0])
  return (
    <table className="min-w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          {columns.map(col => (
            <th key={col} className="border px-2 py-1 text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {answer.data.map((row, i) => (
          <tr key={i} className="odd:bg-white even:bg-gray-50">
            {columns.map(col => (
              <td key={col} className="border px-2 py-1">
                {String(row[col])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
