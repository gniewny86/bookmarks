import { useState } from 'react'
import { addItem, isNameTakenLocally } from '../lib/bookmarks'
import Loader from './Loader'

export default function AddElementModal({ parentId, allItems, onClose, onAdded }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const type = url.trim() ? 'file' : 'folder'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const trimmedName = name.trim()
    const trimmedUrl = url.trim()
    if (!trimmedName) return

    if (isNameTakenLocally(allItems, trimmedName, parentId)) {
      setError('A folder or file with this name already exists here.')
      return
    }

    setSaving(true)
    try {
      const newItem = await addItem({ name: trimmedName, url: trimmedUrl, parentId })
      onAdded(newItem)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {saving && <Loader />}
      <div
        className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 md:items-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 mb-6 mx-4 md:mb-0 md:mx-0"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-base font-semibold text-gray-900 mb-4">Add element</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <input
                autoFocus
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="url"
                placeholder="URL (leave empty to create a folder)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {type === 'folder' ? 'Will create a folder' : 'Will create a file (bookmark)'}
              </p>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-[12px] font-bold uppercase hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="cursor-pointer flex-1 bg-blue-600 text-white rounded-lg py-2 text-[12px] font-bold uppercase hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Adding…' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
