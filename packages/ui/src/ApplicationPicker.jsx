import { useEffect, useRef } from 'react'

const APPLICATIONS = [
  { title: 'Bookmarks', path: '/bookmarks' },
  { title: 'Calendar', path: '/calendar' },
  { title: 'Passwords', path: '/passwords' },
]

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')

export default function ApplicationPicker({ onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="modal application-picker"
      aria-labelledby="application-picker-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom
        ) onClose()
      }}
    >
      <h2 id="application-picker-title" className="modal__title">Applications</h2>
      <nav aria-label="Applications">
        <ul className="application-picker__list">
          {APPLICATIONS.map((app) => {
            const href = `${BASE}${app.path}`
            const active = window.location.pathname.replace(/\/+$/, '') === href
            return (
              <li key={app.path}>
                <a
                  className="application-picker__link"
                  href={href}
                  aria-current={active ? 'page' : undefined}
                >
                  {app.title}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <button type="button" className="modal__btn modal__btn--cancel application-picker__close" onClick={onClose}>
        Close
      </button>
    </dialog>
  )
}
