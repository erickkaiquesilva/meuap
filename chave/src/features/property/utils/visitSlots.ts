export type VisitMode = 'weekdays' | 'custom'

export type VisitScheduleSlot = {
  dayOfWeek: number
  startHour: number
  endHour: number
}

export type VisitSchedule = {
  weekdays?: boolean
  startHour?: number
  endHour?: number
  slots?: VisitScheduleSlot[]
}

export type VisitSlotOption = {
  id: string
  slotStart: string
  slotEnd: string
  label: string
}

const DEFAULT_SCHEDULE: VisitSchedule = {
  weekdays: true,
  startHour: 9,
  endHour: 18,
}

function dayWindows(
  mode: VisitMode | undefined,
  schedule: VisitSchedule | undefined,
  dayOfWeek: number,
): Array<{ startHour: number; endHour: number }> {
  const resolved = schedule ?? DEFAULT_SCHEDULE
  const resolvedMode = mode ?? 'weekdays'

  if (resolvedMode === 'weekdays') {
    if (dayOfWeek === 0 || dayOfWeek === 6) return []
    return [
      {
        startHour: resolved.startHour ?? 9,
        endHour: resolved.endHour ?? 18,
      },
    ]
  }

  return (resolved.slots ?? []).filter((slot) => slot.dayOfWeek === dayOfWeek)
}

function formatLabel(start: Date, end: Date): string {
  const date = start.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  })
  const startHour = start.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
  const endHour = end.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
  return `${date} · ${startHour}–${endHour}`
}

/** Upcoming 1h slots (UTC) for the next `days` calendar days. */
export function buildAvailableSlots(options: {
  visitMode?: VisitMode
  visitSchedule?: VisitSchedule
  from?: Date
  days?: number
  limit?: number
}): VisitSlotOption[] {
  const from = options.from ?? new Date()
  const days = options.days ?? 14
  const limit = options.limit ?? 24
  const cursor = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 0, 0, 0, 0),
  )
  const now = from.getTime()
  const result: VisitSlotOption[] = []

  for (let day = 0; day < days && result.length < limit; day += 1) {
    const dayDate = new Date(cursor)
    dayDate.setUTCDate(cursor.getUTCDate() + day)
    const windows = dayWindows(options.visitMode, options.visitSchedule, dayDate.getUTCDay())

    for (const window of windows) {
      for (let hour = window.startHour; hour < window.endHour; hour += 1) {
        const slotStart = new Date(dayDate)
        slotStart.setUTCHours(hour, 0, 0, 0)
        const slotEnd = new Date(slotStart)
        slotEnd.setUTCHours(hour + 1, 0, 0, 0)
        if (slotStart.getTime() <= now) continue

        result.push({
          id: slotStart.toISOString(),
          slotStart: slotStart.toISOString(),
          slotEnd: slotEnd.toISOString(),
          label: formatLabel(slotStart, slotEnd),
        })
        if (result.length >= limit) return result
      }
    }
  }

  return result
}
