'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type BrandSettings = {
  logo?: string
  primary: string
  secondary: string
  background: string
  accent: string
}

const defaultSettings: BrandSettings = {
  logo: undefined,
  primary: '#000000',
  secondary: '#ffffff',
  background: '#ffffff',
  accent: '#0000ff',
}

interface BrandContextValue {
  settings: BrandSettings
  update: (s: Partial<BrandSettings>) => void
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined)

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<BrandSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings
    const stored = localStorage.getItem('brand-settings')
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--brand-primary', settings.primary)
    root.style.setProperty('--brand-secondary', settings.secondary)
    root.style.setProperty('--brand-background', settings.background)
    root.style.setProperty('--brand-accent', settings.accent)
    if (typeof window !== 'undefined') {
      localStorage.setItem('brand-settings', JSON.stringify(settings))
    }
  }, [settings])

  const update = (s: Partial<BrandSettings>) => {
    setSettings(prev => ({ ...prev, ...s }))
  }

  return <BrandContext.Provider value={{ settings, update }}>{children}</BrandContext.Provider>
}

export const useBrand = () => {
  const ctx = useContext(BrandContext)
  if (!ctx) throw new Error('useBrand must be used within BrandProvider')
  return ctx
}
