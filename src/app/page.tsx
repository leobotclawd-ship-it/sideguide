'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentGuides()
  }, [])

  const fetchRecentGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('decklists')
        .select('*, sideguides(*)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(6)

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
    <main>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            SideGuide
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 mb-12">
            Create and share MTG sideboard guides with visual matchup layouts
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/create"
              className="px-8 py-4 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded-lg transition"
            >
              Create Sideguide
            </Link>
            <Link
              href="/guides"
              className="px-8 py-4 border border-gold-600 text-gold-400 hover:text-gold-300 font-semibold rounded-lg transition"
            >
              Browse Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="py-20 px-4 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-white">Featured Guides</h2>

          {loading ? (
            <div className="text-center text-neutral-400">Loading guides...</div>
          ) : guides.length === 0 ? (
            <div className="text-center text-neutral-400">
              No public guides yet. Be the first to create one!
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
                    {guide.sideguides?.length || 0} matchup guides
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to improve your sideboarding?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Start creating your first sideboard guide today. It only takes a few minutes.
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded-lg transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
      <Footer />
    </>
  )
}
