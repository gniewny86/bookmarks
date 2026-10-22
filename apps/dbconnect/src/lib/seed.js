import { seedItems } from '@bookmarks/app-bookmarks/seed'
import { seedEvents } from '@bookmarks/app-calendar/seed'

const DATE_PATTERN = /^\d{4}\.\d{2}\.\d{2}$/

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function validateNodes(nodes, path) {
  assert(Array.isArray(nodes), `${path} must be an array.`)

  nodes.forEach((node, index) => {
    const where = `${path}[${index}]`

    assert(node && typeof node === 'object', `${where} must be an object.`)
    assert(
      typeof node.name === 'string' && node.name.trim() !== '',
      `${where} is missing a name.`,
    )

    if (node.url !== undefined && node.url !== null) {
      assert(typeof node.url === 'string', `${where} has an invalid url.`)
    }

    if (node.children !== undefined) {
      validateNodes(node.children, `${where}.children`)
    }
  })
}

function countNodes(nodes) {
  return nodes.reduce((total, node) => total + 1 + countNodes(node.children ?? []), 0)
}

/**
 * Validates an uploaded bookmarks file and returns the tree to seed.
 *
 * Accepts the dbconnect dump format (`{ module: "bookmarks", items: [...] }`)
 * and a plain array of tree nodes.
 */
export function parseBookmarksFile(data) {
  if (Array.isArray(data)) {
    validateNodes(data, 'items')

    return { items: data, count: countNodes(data) }
  }

  assert(data && typeof data === 'object', 'The file is not a JSON export.')
  assert(
    !data.module || data.module === 'bookmarks',
    `This is a "${data.module}" export — upload it in the matching row.`,
  )
  assert(Array.isArray(data.items), 'Missing the "items" array — this is not a bookmarks export.')

  validateNodes(data.items, 'items')

  return { items: data.items, count: countNodes(data.items) }
}

/**
 * Validates an uploaded calendar file and returns the events to seed.
 *
 * Accepts the dbconnect dump format (`{ module: "calendar", events: [...] }`)
 * and a plain `{ events: [...] }` object.
 */
export function parseCalendarFile(data) {
  assert(
    data && typeof data === 'object' && !Array.isArray(data),
    'The file is not a JSON export.',
  )
  assert(
    !data.module || data.module === 'calendar',
    `This is a "${data.module}" export — upload it in the matching row.`,
  )
  assert(Array.isArray(data.events), 'Missing the "events" array — this is not a calendar export.')

  data.events.forEach((event, index) => {
    const where = `events[${index}]`

    assert(event && typeof event === 'object', `${where} must be an object.`)
    assert(typeof event.id === 'string' && event.id !== '', `${where} is missing an id.`)
    assert(
      typeof event.date === 'string' && DATE_PATTERN.test(event.date),
      `${where} has an invalid date (expected YYYY.MM.DD).`,
    )
    assert(Array.isArray(event.tags), `${where} is missing a tags array.`)

    event.tags.forEach((tag, tagIndex) => {
      assert(typeof tag === 'string', `${where}.tags[${tagIndex}] must be a string.`)
    })
  })

  return { events: data.events, count: data.events.length }
}

/**
 * Replaces the whole `items` collection with the uploaded tree.
 */
export async function seedBookmarks(data) {
  const { items } = parseBookmarksFile(data)
  const { deleted, seeded } = await seedItems(items)

  return { deleted, seeded }
}

/**
 * Replaces the whole `calendar` collection with the uploaded events.
 */
export async function seedCalendar(data) {
  const { events } = parseCalendarFile(data)
  const { deleted, seeded } = await seedEvents(events)

  return { deleted, seeded }
}
