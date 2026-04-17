import { useState, useMemo } from 'react'
import { updateItem, deleteItem, isNameTakenLocally } from '../lib/bookmarks'
import FolderIcon from '../icons/FolderIcon'
import Loader from './Loader'

export default function EditElementModal({ item, allItems, onClose, onUpdated, onDeleted }) {
  const isFile = item.type === 'file'

  const [name, setName] = useState(item.name)
  const [url, setUrl] = useState(item.url || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Folder picker (files only)
  const [pickerStack, setPickerStack] = useState([{ id: null, name: 'Home' }])
  const [selectedParentId, setSelectedParentId] = useState(item.parentId ?? null)
  const [selectedParentName, setSelectedParentName] = useState(null)

  const pickerCurrent = pickerStack[pickerStack.length - 1]

  const pickerFolders = useMemo(() =>
    allItems
      .filter(
        (i) =>
          i.type === 'folder' &&
          (i.parentId ?? null) === (pickerCurrent.id ?? null) &&
          i.id !== item.id,
      )
      .sort((a, b) => a.name.localeCompare(b.name)),
    [allItems, pickerCurrent.id, item.id],
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const trimmedName = name.trim()
    const trimmedUrl = url.trim()
    if (!trimmedName) return

    const newParentId = isFile ? selectedParentId : (item.parentId ?? null)
    const nameChanged = trimmedName !== item.name
    const parentChanged = isFile && newParentId !== (item.parentId ?? null)

    if (nameChanged || parentChanged) {
      if (isNameTakenLocally(allItems, trimmedName, newParentId, item.id)) {
        setError('A folder or file with this name already exists there.')
        return
      }
    }

    setSaving(true)
    try {
      const updates = { name: trimmedName }
      if (isFile) {
        updates.url = trimmedUrl
        updates.parentId = newParentId
      }
      await updateItem(item.id, updates)
      onUpdated({ ...item, ...updates })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteItem(item.id)
      onDeleted(item.id)
    } catch {
      setError('Could not delete. Please try again.')
      setDeleting(false)
    }
  }

  const destinationLabel = selectedParentName ?? (item.parentId == null ? 'Home' : null)

  return (
    <>
      {(saving || deleting) && <Loader />}
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal__title">Edit {isFile ? 'bookmark' : 'folder'}</h2>

          <form onSubmit={handleSubmit} className="modal__form">
            <input
              autoFocus
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="modal__input"
            />

            {isFile && (
              <input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="modal__input"
              />
            )}

            {isFile && (
              <div>
                <p className="modal__field-label">Move to folder</p>
                <div className="folder-picker">

                  {/* Picker breadcrumb */}
                  <div className="folder-picker__breadcrumb">
                    {pickerStack.map((crumb, i) => (
                      <span key={i} className="folder-picker__crumb-item">
                        {i > 0 && <span className="folder-picker__crumb-sep">/</span>}
                        <button
                          type="button"
                          disabled={i === pickerStack.length - 1}
                          onClick={() => setPickerStack((s) => s.slice(0, i + 1))}
                          className={
                            i === pickerStack.length - 1
                              ? 'folder-picker__crumb-link folder-picker__crumb-link--current'
                              : 'folder-picker__crumb-link'
                          }
                        >
                          {crumb.name}
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Folder list */}
                  <div className="folder-picker__list">
                    {pickerStack.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPickerStack((s) => s.slice(0, -1))}
                        className="folder-picker__row"
                      >
                        <FolderIcon className="folder-picker__row-icon" />
                        ...
                      </button>
                    )}
                    {pickerFolders.map((folder) => (
                      <button
                        type="button"
                        key={folder.id}
                        onClick={() => setPickerStack((s) => [...s, { id: folder.id, name: folder.name }])}
                        className="folder-picker__row"
                      >
                        <FolderIcon className="folder-picker__row-icon" />
                        {folder.name}
                      </button>
                    ))}
                    {pickerFolders.length === 0 && pickerStack.length === 1 && (
                      <p className="folder-picker__empty">No folders available</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="folder-picker__footer">
                    <span className="folder-picker__footer-label">
                      Browsing: <span className="folder-picker__footer-path">{pickerCurrent.name}</span>
                    </span>
                    <button
                      type="button"
                      disabled={selectedParentId === pickerCurrent.id}
                      onClick={() => {
                        setSelectedParentId(pickerCurrent.id)
                        setSelectedParentName(pickerCurrent.name)
                      }}
                      className="folder-picker__select-btn"
                    >
                      Select
                    </button>
                  </div>
                </div>

                {destinationLabel && (
                  <p className="modal__hint">
                    Destination: <span className="folder-picker__footer-path">{destinationLabel}</span>
                  </p>
                )}
              </div>
            )}

            {error && <p className="modal__error">{error}</p>}

            <div className="modal__actions">
              <button type="button" onClick={onClose} className="modal__btn modal__btn--cancel">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting || !name.trim()}
                className="modal__btn modal__btn--submit"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>

            <button
              type="button"
              disabled={deleting || saving}
              onClick={handleDelete}
              className="modal__btn modal__btn--delete"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
