import { useState } from 'react'
import { Loader, Modal } from '@bookmarks/ui'

export default function EventModal({ event, onClose, onSave, onDelete, onDuplicate }) {
  const isNew = event.id === null
  const [date, setDate] = useState(event.date.replaceAll('.', '-'))
  const [tags, setTags] = useState(event.tags)
  const [tagInput, setTagInput] = useState('')
  const [pending, setPending] = useState(null)
  const [error, setError] = useState('')

  const canSave = date !== ''

  async function run(kind, action, message) {
    setPending(kind)
    setError('')

    try {
      await action()
    } catch {
      setError(message)
      setPending(null)
    }
  }

  function addTag() {
    const value = tagInput.trim().toLowerCase()
    if (!value) return

    setTags((current) => (current.includes(value) ? current : [...current, value]))
    setTagInput('')
  }

  function removeTag(tag) {
    setTags((current) => current.filter((item) => item !== tag))
  }

  function handleTagKeyDown(e) {
    if (e.key !== 'Enter') return

    e.preventDefault()
    addTag()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSave || pending) return

    run(
      'save',
      () => onSave({ ...event, date: date.replaceAll('-', '.'), tags }),
      'Could not save. Please try again.',
    )
  }

  function handleDelete() {
    run('delete', onDelete, 'Could not delete. Please try again.')
  }

  function handleDuplicate() {
    run(
      'duplicate',
      () => onDuplicate({ ...event, tags }),
      'Could not duplicate. Please try again.',
    )
  }

  return (
    <>
      {pending && <Loader />}
      <Modal title={isNew ? 'Add event' : 'Edit event'} onClose={onClose}>
        <form onSubmit={handleSubmit} className="modal__form">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            aria-label="Date"
            className="modal__input"
          />

          <div className="event-modal__tag-form">
            <input
              type="text"
              placeholder="Event"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              aria-label="Event"
              className="modal__input"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim()}
              aria-label="Add event"
              className="event-modal__add"
            >
              <svg
                className="event-modal__add-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {tags.length > 0 && (
            <div className="event-modal__tags">
              {tags.map((tag) => (
                <span key={tag} className="tag tag--removable">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                    className="tag__remove"
                  >
                    <svg
                      className="tag__remove-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button
              type="button"
              onClick={onClose}
              disabled={pending !== null}
              className="modal__btn modal__btn--cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave || pending !== null}
              className="modal__btn modal__btn--submit"
            >
              {pending === 'save' ? 'Saving…' : 'Save'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDuplicate}
            disabled={pending !== null}
            className="modal__btn event-modal__duplicate"
          >
            {pending === 'duplicate' ? 'Duplicating…' : 'Duplicate'}
          </button>

          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending !== null}
              className="modal__btn modal__btn--delete"
            >
              {pending === 'delete' ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </form>
      </Modal>
    </>
  )
}
