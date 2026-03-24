export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gold-400 mb-4">SideGuide</h3>
            <p className="text-neutral-400">
              Create and share MTG sideboard guides with visual matchup layouts.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-gold-400 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-gold-400 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Terms</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center text-neutral-500">
          <p>&copy; 2026 SideGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
