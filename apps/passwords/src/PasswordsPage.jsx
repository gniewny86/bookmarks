import { useEffect, useState } from 'react'
import { PageHeader } from '@bookmarks/ui'
import { BookmarkIcon } from '@bookmarks/assets'
import { generatePasswords } from './lib/passwords.js'
import './styles.css'

function RefreshIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9" />
    </svg>
  )
}

export default function PasswordsPage() {
  const [groups, setGroups] = useState(generatePasswords)
  const [copyStatus, setCopyStatus] = useState(null)

  useEffect(() => {
    if (!copyStatus) return

    const timeout = window.setTimeout(() => setCopyStatus(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [copyStatus])

  function handleGenerate() {
    setGroups(generatePasswords())
    setCopyStatus(null)
  }

  async function handleCopy(password, id) {
    try {
      await navigator.clipboard.writeText(password)
      setCopyStatus({ id, type: 'success', message: 'Password copied to clipboard.' })
    } catch {
      setCopyStatus({ id, type: 'error', message: 'Could not copy. Select and copy the password manually.' })
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Passwords"
        icon={BookmarkIcon}
        addLabel="Generate"
        addIcon={RefreshIcon}
        onAdd={handleGenerate}
      />
      <main className="page__content">
        <div className="password-groups">
          {groups.map((passwords, groupIndex) => (
            <ul key={groupIndex} className="password-list" aria-label={`Password group ${groupIndex + 1}`}>
              {passwords.map((password, index) => {
                const id = `${groupIndex}-${index}`
                const copied = copyStatus?.id === id && copyStatus.type === 'success'
                return (
                  <li key={id} className="password-card">
                    <span className="password-card__value">{password}</span>
                    <button
                      type="button"
                      className="password-card__copy"
                      aria-label={`Copy password ${groupIndex * 3 + index + 1}`}
                      onClick={() => handleCopy(password, id)}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      </main>
      <div className="password-status" role="status" aria-atomic="true">
        {copyStatus && (
          <p className={`password-status__text password-status__text--${copyStatus.type}`}>
            {copyStatus.message}
          </p>
        )}
      </div>
    </div>
  )
}
