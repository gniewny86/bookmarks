import { useState, useEffect, useMemo } from 'react'
import { getAllItems } from '../lib/bookmarks'
import AddElementModal from '../components/AddElementModal'
import EditElementModal from '../components/EditElementModal'
import Loader from '../components/Loader'
import FolderIcon from '../icons/FolderIcon'
import FileIcon from '../icons/FileIcon'

function UpItem({ onClick }) {
  return (
    <button onClick={onClick} className="item-card">
      <FolderIcon className="item-card__icon--mobile" />
      <FolderIcon className="item-card__icon--desktop" />
      <span className="item-card__label">...</span>
    </button>
  )
}

function Item({ item, onClick, onEdit, onHover }) {
  const Icon = item.type === 'folder' ? FolderIcon : FileIcon

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
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
      className="item-card"
    >
      <Icon className="item-card__icon--mobile" />
      <Icon className="item-card__icon--desktop" />
      <span className="item-card__label item-card__label--truncate">
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
  const [hoveredItem, setHoveredItem] = useState(null)

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
    <div className="page">
      {loading && <Loader />}

      <header className="page__header">
        <span className="page__title">Bookmarks</span>
        <div className="page__controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="page__search"
          />
          <button onClick={() => setShowAddModal(true)} className="page__add-btn">
            <svg className="page__add-btn-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add element
          </button>
        </div>
      </header>

      <nav className="breadcrumb">
        {isSearching ? (
          <span className="breadcrumb__link breadcrumb__link--current">Search results:</span>
        ) : (
          stack.map((crumb, i) => (
            <span key={i} className="breadcrumb__item">
              {i > 0 && <span className="breadcrumb__sep">/</span>}
              <button
                onClick={() => navigateTo(i)}
                disabled={i === stack.length - 1}
                className={
                  i === stack.length - 1
                    ? 'breadcrumb__link breadcrumb__link--current'
                    : 'breadcrumb__link'
                }
              >
                {crumb.name}
              </button>
            </span>
          ))
        )}
      </nav>

      <main className="page__content">
        {isSearching ? (
          searchResults.length === 0 ? (
            <p className="page__empty">No results found.</p>
          ) : (
            <div className="item-grid--search">
              {searchResults.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  onEdit={() => setEditingItem(item)}
                  onHover={setHoveredItem}
                />
              ))}
            </div>
          )
        ) : (
          <>
            {!loading && currentItems.length === 0 && stack.length === 1 ? (
              <p className="page__empty">This folder is empty. Add a folder or bookmark.</p>
            ) : (
              <>
                <div className="item-list">
                  {stack.length > 1 && (
                    <UpItem onClick={() => navigateTo(stack.length - 2)} />
                  )}
                  {currentItems.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      onEdit={() => setEditingItem(item)}
                      onHover={setHoveredItem}
                    />
                  ))}
                </div>

                <div className="item-grid">
                  {stack.length > 1 && (
                    <UpItem onClick={() => navigateTo(stack.length - 2)} />
                  )}
                  {currentItems.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      onEdit={() => setEditingItem(item)}
                      onHover={setHoveredItem}
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

      {hoveredItem && (
        <div className="status-bar">
          <span className="status-bar__text">
            {hoveredItem.name}
            {hoveredItem.url && <> · {hoveredItem.url}</>}
          </span>
        </div>
      )}
    </div>
  )
}
