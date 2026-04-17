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
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal__title">Add element</h2>

          <form onSubmit={handleSubmit} className="modal__form">
            <div>
              <input
                autoFocus
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="modal__input"
              />
            </div>

            <div>
              <input
                type="url"
                placeholder="URL (leave empty to create a folder)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="modal__input"
              />
              <p className="modal__hint">
                {type === 'folder' ? 'Will create a folder' : 'Will create a file (bookmark)'}
              </p>
            </div>

            {error && <p className="modal__error">{error}</p>}

            <div className="modal__actions">
              <button type="button" onClick={onClose} className="modal__btn modal__btn--cancel">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="modal__btn modal__btn--submit"
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
