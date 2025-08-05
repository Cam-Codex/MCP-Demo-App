'use client'

import Image from 'next/image'
import { useBrand } from '../components/BrandProvider'
import SearchBar from '../components/SearchBar'
import React from 'react'

export default function Page() {
  const { settings } = useBrand()
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 text-center">
      {settings.logo && (
        <Image src={settings.logo} alt="logo" width={160} height={80} className="object-contain" />
      )}
      <h1 className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
        Ask your data anything
      </h1>
      <SearchBar />
    </main>
  )
}
