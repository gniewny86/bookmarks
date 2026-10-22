/**
 * Calendar view helpers. Firestore access lives in `events.js`.
 */

/**
 * Today's local date in the app's `YYYY.MM.DD` format.
 */
export function getTodayDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${now.getFullYear()}.${month}.${day}`
}

/**
 * Groups events by month, newest first. Each group is
 * `{ month: "YYYY.MM", events: [...] }`; events inside a group are newest first
 * too. `YYYY.MM.DD` sorts lexicographically, so no date parsing is needed.
 */
export function groupEventsByMonth(eventList) {
  const sorted = [...eventList].sort((a, b) => b.date.localeCompare(a.date))
  const groups = new Map()

  for (const event of sorted) {
    const month = event.date.slice(0, 7)

    if (!groups.has(month)) {
      groups.set(month, { month, events: [] })
    }

    groups.get(month).events.push(event)
  }

  return [...groups.values()]
}
