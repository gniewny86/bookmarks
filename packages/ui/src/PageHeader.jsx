import { useState } from 'react'
import ApplicationPicker from './ApplicationPicker.jsx'

export default function PageHeader({
  title,
  icon: Icon,
  searchValue,
  onSearchChange,
  viewMode,
  onViewToggle,
  addLabel,
  addIcon: AddIcon,
  onAdd,
}) {
  const [showApplications, setShowApplications] = useState(false)

  return (
    <header className="page__header">
      <button
        type="button"
        className="page__title"
        aria-haspopup="dialog"
        aria-expanded={showApplications}
        onClick={() => setShowApplications(true)}
      >
        {Icon && <Icon className="page__title-icon" />}
        {title}
      </button>
      <div className="page__controls">
        {onSearchChange && (
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="page__search"
          />
        )}
        {onViewToggle && (
          <button
            onClick={onViewToggle}
            className="view-toggle"
            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            {viewMode === 'grid' ? (
              <svg viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="2.5" rx="1" />
                <rect x="1" y="6.75" width="14" height="2.5" rx="1" />
                <rect x="1" y="11.5" width="14" height="2.5" rx="1" />
              </svg>
            )}
          </button>
        )}
        {onAdd && (
          <button onClick={onAdd} className="page__add-btn">
            {AddIcon ? <AddIcon className="page__add-btn-icon" /> : <svg className="page__add-btn-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>}
            {addLabel}
          </button>
        )}
      </div>
      {showApplications && <ApplicationPicker onClose={() => setShowApplications(false)} />}
    </header>
  )
}
