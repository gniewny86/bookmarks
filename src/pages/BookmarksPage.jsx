import { useState, useEffect, useMemo } from 'react'
import { getAllItems } from '../lib/bookmarks'
import AddElementModal from '../components/AddElementModal'
import EditElementModal from '../components/EditElementModal'
import Loader from '../components/Loader'
import folderIcon from '../assets/folder.svg'
import fileIcon from '../assets/file.svg'

function UpItem({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer w-full text-left hover:bg-white hover:shadow-sm rounded-xl transition-all
        flex flex-row items-center gap-3 px-3 py-2
        md:flex-col md:items-center md:justify-center md:gap-2 md:p-3 md:text-center md:w-[102px] md:h-32"
    >
      <img src={folderIcon} alt="" className="w-6 h-6 shrink-0 md:hidden" />
      <img src={folderIcon} alt="" className="w-16 h-16 hidden md:block" />
      <span className="text-sm md:text-sm text-gray-700 leading-tight">...</span>
    </button>
  )
}

function Item({ item, onClick, onEdit }) {
  const icon = item.type === 'folder' ? folderIcon : fileIcon

  function handleClick(e) {
    if (e.shiftKey) {
      e.preventDefault()
      onEdit()
    } else {
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer w-full text-left hover:bg-white hover:shadow-sm rounded-xl transition-all
        flex flex-row items-center gap-3 px-3 py-2
        md:flex-col md:items-center md:justify-center md:gap-2 md:p-3 md:text-center md:w-[102px] md:h-32"
    >
      <img src={icon} alt="" className="w-6 h-6 shrink-0 md:hidden" />
      <img src={icon} alt="" className="w-16 h-16 hidden md:block" />
      <span className="text-sm md:text-sm text-gray-700 leading-tight truncate w-full">
        {item.name}
      </span>
    </button>
  )
}

export default function BookmarksPage() {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [stack, setStack] = useState([{ id: null, name: 'Home' }])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const currentFolder = stack[stack.length - 1]

  // Fetch all items once on mount
  useEffect(() => {
    getAllItems().then((items) => {
      setAllItems(items)
      setLoading(false)
    })
  }, [])

  // Derive current folder's items from in-memory state
  const currentItems = useMemo(() => {
    return allItems
      .filter((item) => (item.parentId ?? null) === (currentFolder.id ?? null))
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
        return a.name.localeCompare(b.name)
      })
  }, [allItems, currentFolder.id])

  // Global search: all files across the entire database matching the query
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return allItems
      .filter(
        (item) =>
          item.type === 'file' &&
          (item.name.toLowerCase().includes(q) ||
            (item.url && item.url.toLowerCase().includes(q))),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allItems, searchQuery])

  const isSearching = searchQuery.trim().length > 0

  function openFolder(item) {
    setSearchQuery('')
    setStack((s) => [...s, { id: item.id, name: item.name }])
  }

  function navigateTo(index) {
    setSearchQuery('')
    setStack((s) => s.slice(0, index + 1))
  }

  function handleItemClick(item) {
    if (item.type === 'folder') {
      openFolder(item)
    } else {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  function handleAdded(newItem) {
    setAllItems((prev) => [...prev, newItem])
    setShowAddModal(false)
  }

  function handleUpdated(updatedItem) {
    setAllItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)))
    setEditingItem(null)
  }

  function handleDeleted(id) {
    setAllItems((prev) => prev.filter((i) => i.id !== id))
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {loading && <Loader />}

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-900 text-base">Bookmarks</span>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hidden md:block border border-gray-200 rounded-lg px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white text-[12px] font-bold uppercase px-4 h-9 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add element
          </button>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="px-6 py-2 flex items-center gap-1 text-sm text-gray-500">
        {isSearching ? (
          <span className="text-gray-900 font-medium">Search results:</span>
        ) : (
          stack.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">/</span>}
              <button
                onClick={() => navigateTo(i)}
                disabled={i === stack.length - 1}
                className={
                  i === stack.length - 1
                    ? 'text-gray-900 font-medium cursor-default'
                    : 'cursor-pointer'
                }
              >
                {crumb.name}
              </button>
            </span>
          ))
        )}
      </nav>

      {/* Content */}
      <main className="flex-1 px-6 py-4">
        {isSearching ? (
          /* Global search results — all matching files, flat, no folders */
          searchResults.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-24">No results found.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
              {searchResults.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  onEdit={() => setEditingItem(item)}
                />
              ))}
            </div>
          )
        ) : (
          <>
            {!loading && currentItems.length === 0 && stack.length === 1 ? (
              <p className="text-center text-gray-400 text-sm mt-24">
                This folder is empty. Add a folder or bookmark.
              </p>
            ) : (
              <>
                {/* Mobile: list */}
                <div className="flex flex-col gap-1 md:hidden">
                  {stack.length > 1 && (
                    <UpItem onClick={() => navigateTo(stack.length - 2)} />
                  )}
                  {currentItems.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      onEdit={() => setEditingItem(item)}
                    />
                  ))}
                </div>

                {/* Desktop: grid */}
                <div className="hidden md:grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
                  {stack.length > 1 && (
                    <UpItem onClick={() => navigateTo(stack.length - 2)} />
                  )}
                  {currentItems.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      onEdit={() => setEditingItem(item)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {showAddModal && (
        <AddElementModal
          parentId={currentFolder.id}
          allItems={allItems}
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      )}

      {editingItem && (
        <EditElementModal
          item={editingItem}
          allItems={allItems}
          onClose={() => setEditingItem(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}
