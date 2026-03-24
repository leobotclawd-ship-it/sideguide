'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function GuidesPage() {
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [format, setFormat] = useState('all')
  const [sort, setSort] = useState('newest')

  const formats = [
    { value: 'all', label: 'All Formats' },
    { value: 'standard', label: 'Standard' },
    { value: 'pioneer', label: 'Pioneer' },
    { value: 'modern', label: 'Modern' },
    { value: 'legacy', label: 'Legacy' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'commander', label: 'Commander' },
  ]

  useEffect(() => {
    fetchGuides()
  }, [format, sort])

  const fetchGuides = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('decklists')
        .select('*, sideguides(*)')
        .eq('is_public', true)

      if (format !== 'all') {
        query = query.eq('format', format)
      }

      let orderBy = 'created_at'
      let ascending = false

      if (sort === 'oldest') {
        ascending = true
      } else if (sort === 'name') {
        orderBy = 'name'
        ascending = true
      }

      const { data, error } = await query.order(orderBy, { ascending })

      if (error) throw error
      setGuides(data || [])
    } catch (err) {
      console.error('Error fetching guides:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-950">
        <section className="py-12 px-4 bg-gradient-to-b from-neutral-900 to-neutral-950">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Browse Sideboard Guides</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white hover:border-gold-600 transition"
                >
                  {formats.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white hover:border-gold-600 transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Guide List */}
            {loading ? (
              <div className="text-center text-neutral-400">Loading guides...</div>
            ) : guides.length === 0 ? (
              <div className="text-center text-neutral-400 py-12">
                No guides found. Try different filters or{' '}
                <Link href="/create" className="text-gold-400 hover:text-gold-300">
                  create one
                </Link>
                !
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.id}`}
                    className="group p-6 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-gold-600 hover:bg-neutral-800 transition"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition">
                      {guide.name}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-4">
                      Format: <span className="text-neutral-300 capitalize">{guide.format}</span>
                    </p>
                    <p className="text-sm text-neutral-500">
                      {guide.sideguides?.length || 0} matchup{' '}
                      {(guide.sideguides?.length || 0) === 1 ? 'guide' : 'guides'}
                    </p>
                    <p className="text-xs text-neutral-600 mt-2">
                      Created{' '}
                      {new Date(guide.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
