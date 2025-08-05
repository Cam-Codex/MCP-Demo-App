'use client'

import React, { useState } from 'react'
import { useBrand } from '../../components/BrandProvider'

export default function SettingsPage() {
  const { settings, update } = useBrand()
  const [logo, setLogo] = useState<string | undefined>(settings.logo)
  const [primary, setPrimary] = useState(settings.primary)
  const [secondary, setSecondary] = useState(settings.secondary)
  const [background, setBackground] = useState(settings.background)
  const [accent, setAccent] = useState(settings.accent)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    update({ logo, primary, secondary, background, accent })
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setLogo(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Brand Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Logo</label>
          <input type="file" accept="image/png,image/svg+xml" onChange={handleLogoUpload} />
          {logo && <img src={logo} alt="logo" className="mt-2 h-16" />}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Primary</label>
            <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Secondary</label>
            <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Background</label>
            <input type="color" value={background} onChange={e => setBackground(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Accent</label>
            <input type="color" value={accent} onChange={e => setAccent(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
      </form>
    </main>
  )
}
