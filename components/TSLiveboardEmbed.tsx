'use client'

import React, { useEffect, useRef } from 'react'

export default function TSLiveboardEmbed({ liveboardId }: { liveboardId: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let embed: any
    async function load() {
      const ts = await import('@thoughtspot/ts-embed')
      embed = new ts.LiveboardEmbed(ref.current!, {
        frameParams: {},
        liveboardId,
      })
      embed.render()
    }
    load()
    return () => {
      embed?.destroy?.()
    }
  }, [liveboardId])

  return <div ref={ref} className="w-full h-[600px]" />
}
