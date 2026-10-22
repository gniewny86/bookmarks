import { getAllItems } from '@bookmarks/app-bookmarks/items'
import { getEvents } from '@bookmarks/app-calendar/events'
import { dumpBookmarks, dumpCalendar } from './dump.js'
import { parseBookmarksFile, parseCalendarFile, seedBookmarks, seedCalendar } from './seed.js'

/**
 * Every module owns its own Firestore collection, so dbconnect works with one
 * entry per module: read the current size, dump it to JSON, validate an
 * uploaded file and seed it back into the same collection.
 */
export const DATABASES = [
  {
    key: 'bookmarks',
    title: 'Bookmarks',
    collection: 'items',
    filePrefix: 'bookmarks',
    readCount: async () => (await getAllItems()).length,
    dump: dumpBookmarks,
    validate: parseBookmarksFile,
    seed: seedBookmarks,
  },
  {
    key: 'calendar',
    title: 'Calendar',
    collection: 'calendar',
    filePrefix: 'calendar',
    readCount: async () => (await getEvents()).length,
    dump: dumpCalendar,
    validate: parseCalendarFile,
    seed: seedCalendar,
  },
]
