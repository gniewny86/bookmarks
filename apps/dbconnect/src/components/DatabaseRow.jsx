import { useEffect, useRef, useState } from 'react'
import { Loader } from '@bookmarks/ui'
import { downloadFileName, downloadJson } from '../lib/dump.js'

export default function DatabaseRow({ database }) {
  const [count, setCount] = useState(null)
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let active = true

    database
      .readCount()
      .then((value) => {
        if (active) setCount(value)
      })
      .catch(() => {
        if (active) setCount(null)
      })

    return () => {
      active = false
    }
  }, [database])

  async function handleDownload() {
    setBusy(true)
    setMessage(null)

    try {
      const dump = await database.dump()
      downloadJson(downloadFileName(database.filePrefix), dump)
      setMessage({ type: 'success', text: `Downloaded ${dump.count} document(s).` })
    } catch {
      setMessage({ type: 'error', text: 'Could not create the dump. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    // Allows picking the same file again after a failed attempt.
    event.target.value = ''

    if (!file) return

    setMessage(null)

    try {
      const parsed = JSON.parse(await file.text())
      const summary = database.validate(parsed)

      setPending({ file, parsed, summary })
    } catch (error) {
      setPending(null)
      setMessage({
        type: 'error',
        text: error instanceof SyntaxError ? 'The file is not valid JSON.' : error.message,
      })
    }
  }

  async function handleSeed() {
    if (!pending) return

    setBusy(true)
    setMessage(null)

    try {
      const result = await database.seed(pending.parsed)

      setCount(result.seeded)
      setPending(null)
      setMessage({
        type: 'success',
        text: `Seeded ${result.seeded} document(s), replaced ${result.deleted}.`,
      })
    } catch {
      setMessage({ type: 'error', text: 'Could not seed the database. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="db-row">
      {busy && <Loader />}

      <div className="db-row__head">
        <div>
          <h2 className="db-row__title">{database.title}</h2>
          <p className="db-row__meta">
            collection <code>{database.collection}</code> ·{' '}
            {count === null ? 'reading…' : `${count} document(s)`}
          </p>
        </div>

        <div className="db-row__actions">
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="db-btn db-btn--secondary"
          >
            Download DB
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="db-btn db-btn--primary"
          >
            Upload DB
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="db-row__file"
          />
        </div>
      </div>

      {pending && (
        <div className="db-row__confirm">
          <p className="db-row__confirm-text">
            <strong>{pending.file.name}</strong> — {pending.summary.count} document(s) ready.
            Seeding replaces the whole <code>{database.collection}</code> collection.
          </p>
          <div className="db-row__confirm-actions">
            <button
              type="button"
              onClick={() => setPending(null)}
              className="db-btn db-btn--ghost"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSeed}
              disabled={busy}
              className="db-btn db-btn--danger"
            >
              Seed database
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className={`db-row__message db-row__message--${message.type}`}>{message.text}</p>
      )}
    </section>
  )
}
