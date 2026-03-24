export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">SideGuide</h1>
        <p className="text-xl text-neutral-400 mb-8">
          Create and share MTG sideboard guides with visual matchup layouts
        </p>
        <button className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded-lg transition">
          Get Started
        </button>
      </div>
    </main>
  )
}
