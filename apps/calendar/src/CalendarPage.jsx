import { useEffect, useState } from 'react'
import { Loader, PageHeader } from '@bookmarks/ui'
import { BookmarkIcon } from '@bookmarks/assets'
import EventModal from './components/EventModal'
import { getTodayDate, groupEventsByMonth } from './lib/data'
import { createEvent, deleteEvent, getEvents, updateEvent } from './lib/events'
import './styles.css'

export default function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    let active = true

    getEvents()
      .then((list) => {
        if (active) setEvents(list)
      })
      .catch(() => {
        if (active) setLoadError('Could not load events. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const query = searchQuery.trim().toLowerCase()
  const isSearching = query.length > 0
  const visibleEvents = isSearching
    ? events.filter(
        (event) =>
          event.date.includes(query.replaceAll('-', '.')) ||
          event.tags.some((tag) => tag.includes(query)),
      )
    : events
  const months = groupEventsByMonth(visibleEvents)

  async function handleSave(updatedEvent) {
    if (updatedEvent.id === null) {
      const created = await createEvent({
        date: updatedEvent.date,
        tags: updatedEvent.tags,
      })
      setEvents((current) => [...current, created])
    } else {
      await updateEvent(updatedEvent)
      setEvents((current) =>
        current.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
      )
    }

    setEditingEvent(null)
  }

  async function handleDelete(eventId) {
    await deleteEvent(eventId)
    setEvents((current) => current.filter((event) => event.id !== eventId))
    setEditingEvent(null)
  }

  async function handleDuplicate(source) {
    const created = await createEvent({
      date: getTodayDate(),
      tags: source.tags,
    })

    setEvents((current) => [...current, created])
    setEditingEvent(null)
  }

  return (
    <div className="page">
      {loading && <Loader />}
      <PageHeader
        title="Calendar"
        icon={BookmarkIcon}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        addLabel="Add event"
        onAdd={() => setEditingEvent({ id: null, date: getTodayDate(), tags: [] })}
      />
      <main className="page__content">
        {loadError ? (
          <p className="event-empty">{loadError}</p>
        ) : loading ? null : months.length === 0 ? (
          <p className="event-empty">{isSearching ? 'No results found.' : 'No events.'}</p>
        ) : (
          <div className="event-months">
            {months.map((group) => (
              <section key={group.month} className="event-month">
                <h2 className="event-month__label">{group.month}</h2>
                <ul className="event-list">
                  {group.events.map((event) => (
                    <li key={event.id}>
                      <button
                        type="button"
                        className="event-card"
                        onClick={() => setEditingEvent(event)}
                      >
                        <time
                          className="event-card__date"
                          dateTime={event.date.replaceAll('.', '-')}
                        >
                          {event.date}
                        </time>
                        {event.tags.length > 0 && (
                          <div className="event-card__tags">
                            {event.tags.map((tag) => (
                              <span key={tag} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      {editingEvent && (
        <EventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSave}
          onDelete={() => handleDelete(editingEvent.id)}
          onDuplicate={handleDuplicate}
        />
      )}
    </div>
  )
}
