'use client'

import { useState } from 'react'
import { showToast } from '@/lib/toast'

interface ShareModalProps {
  guideId: string
  guideName: string
  isPublic: boolean
  onTogglePublic: (isPublic: boolean) => Promise<void>
  onClose: () => void
}

export default function ShareModal({
  guideId,
  guideName,
  isPublic,
  onTogglePublic,
  onClose,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [toggling, setToggling] = useState(false)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/guides/${guideId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    showToast('Link copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTogglePublic = async () => {
    setToggling(true)
    try {
      await onTogglePublic(!isPublic)
      showToast(
        isPublic ? 'Guide made private' : 'Guide made public',
        'success'
      )
    } catch (err) {
      showToast('Error updating privacy settings', 'error')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Share "{guideName}"</h2>

        {/* Privacy Setting */}
        <div className="mb-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
          <h3 className="font-semibold text-white mb-3">Privacy Setting</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-300">
                {isPublic ? 'Public - Anyone can view' : 'Private - Link only'}
              </p>
              <p className="text-xs text-neutral-500">
                {isPublic
                  ? 'Your guide appears on the public guides page'
                  : 'Only people with the link can see this'}
              </p>
            </div>
            <button
              onClick={handleTogglePublic}
              disabled={toggling}
              className={`px-4 py-2 rounded font-semibold transition ${
                isPublic
                  ? 'bg-gold-600 hover:bg-gold-700 text-white'
                  : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
              } disabled:opacity-50`}
            >
              {toggling ? 'Updating...' : isPublic ? 'Make Private' : 'Make Public'}
            </button>
          </div>
        </div>

        {/* Share Link */}
        {isPublic && (
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-3">Share Link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-neutral-300 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded font-semibold transition ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gold-600 hover:bg-gold-700 text-white'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mb-6 p-3 bg-blue-900/20 border border-blue-800 rounded text-sm text-blue-300">
          {isPublic
            ? 'Your guide will appear in the public guides library and in search results.'
            : 'Only share this link with people you trust. They will not be able to edit your guide.'}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}
