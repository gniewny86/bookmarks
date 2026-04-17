import { useState, useMemo } from 'react'
import { updateItem, deleteItem, isNameTakenLocally } from '../lib/bookmarks'
import folderIcon from '../assets/folder.svg'
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
      <div
        className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 md:items-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 mb-6 mx-4 md:mb-0 md:mx-0"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Edit {isFile ? 'bookmark' : 'folder'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {isFile && (
              <input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            {isFile && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Move to folder</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden">

                  {/* Picker breadcrumb */}
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200 flex items-center gap-1 flex-wrap">
                    {pickerStack.map((crumb, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {i > 0 && <span className="text-gray-300 text-xs">/</span>}
                        <button
                          type="button"
                          disabled={i === pickerStack.length - 1}
                          onClick={() => setPickerStack((s) => s.slice(0, i + 1))}
                          className={`text-xs ${i === pickerStack.length - 1 ? 'font-medium text-gray-700 cursor-default' : 'cursor-pointer text-gray-500'}`}
                        >
                          {crumb.name}
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Folder list */}
                  <div className="max-h-28 overflow-y-auto">
                    {pickerStack.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPickerStack((s) => s.slice(0, -1))}
                        className="cursor-pointer w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        <img src={folderIcon} alt="" className="w-4 h-4" />
                        ...
                      </button>
                    )}
                    {pickerFolders.map((folder) => (
                      <button
                        type="button"
                        key={folder.id}
                        onClick={() => setPickerStack((s) => [...s, { id: folder.id, name: folder.name }])}
                        className="cursor-pointer w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        <img src={folderIcon} alt="" className="w-4 h-4" />
                        {folder.name}
                      </button>
                    ))}
                    {pickerFolders.length === 0 && pickerStack.length === 1 && (
                      <p className="text-xs text-gray-400 text-center py-2">No folders available</p>
                    )}
                  </div>

                  {/* Select button */}
                  <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Browsing: <span className="font-medium text-gray-700">{pickerCurrent.name}</span>
                    </span>
                    <button
                      type="button"
                      disabled={selectedParentId === pickerCurrent.id}
                      onClick={() => {
                        setSelectedParentId(pickerCurrent.id)
                        setSelectedParentName(pickerCurrent.name)
                      }}
                      className="cursor-pointer text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-40 disabled:cursor-default transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>

                {destinationLabel && (
                  <p className="text-xs text-gray-400 mt-1">
                    Destination: <span className="font-medium text-gray-600">{destinationLabel}</span>
                  </p>
                )}
              </div>
            )}

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
                disabled={saving || deleting || !name.trim()}
                className="cursor-pointer flex-1 bg-blue-600 text-white rounded-lg py-2 text-[12px] font-bold uppercase hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>

            <button
              type="button"
              disabled={deleting || saving}
              onClick={handleDelete}
              className="cursor-pointer w-full border border-red-200 text-red-500 rounded-lg py-2 text-[12px] font-bold uppercase hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
