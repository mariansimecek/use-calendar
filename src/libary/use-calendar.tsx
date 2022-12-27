import { isToday } from "date-fns"
import { useCallback, useState } from "react"
//TODO: hour mode
//TODO: add useCallback and useMemo to optimize
//TODO: add selection feature

interface UseCalendarOptions {
  initalDate?: Date
  initalMode?: CalendarMode
  weekStartsOn?: CalendarWeek
  minDate?: Date
  maxDate?: Date
  alignByWeek?: boolean
  appendDaysToFillRect?: boolean
  yearsToRender?: number
}

export const VIEW_MODE = {
  MONTH: "month",
  YEAR: "year",
  DECADE: "decade"
} as const;

type ObjectValues<T> = T[keyof T]
type CalendarMode = ObjectValues<typeof VIEW_MODE>

interface DateUnit {
  num: number,
  type: "day" | "month" | "year"
  date: Date
  inMonth?: boolean
  today?: boolean
}
type CalendarWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const useCalendar = (options?: UseCalendarOptions) => {
  const [currentDate, setCurrentDate] = useState(options?.initalDate || new Date())
  const [mode, setMode] = useState<CalendarMode>(options?.initalMode || VIEW_MODE.MONTH)
  const yearToRender = options?.yearsToRender || 14
  const weekStartsOn = options?.weekStartsOn || 0

  const getWeeks = useCallback(() => {
    // get weeks and shift by weekStartsOn
    const weeks = [...Array(7)].map((_, i) => (i + weekStartsOn) % 7)
    return weeks as CalendarWeek[]
  }, [weekStartsOn])

  const weeks: CalendarWeek[] = getWeeks()
  function moveDateByDay(date: Date, amount: number, direction: boolean): Date {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + (direction ? amount : -amount))
    return newDate
  }
  function moveDateByMonth(date: Date, amount: number, direction: boolean): Date {
    const newDate = new Date(date)
    newDate.setMonth(date.getMonth() + (direction ? amount : -amount))
    return newDate
  }
  function moveDateByYear(date: Date, amount: number, direction: boolean): Date {
    const newDate = new Date(date)
    newDate.setFullYear(date.getFullYear() + (direction ? amount : -amount))
    return newDate
  }

  function prev() {
    switch (mode) {
      case VIEW_MODE.MONTH: setCurrentDate(moveDateByMonth(currentDate, 1, false)); break;
      case VIEW_MODE.YEAR: setCurrentDate(moveDateByYear(currentDate, 1, false)); break;
      case VIEW_MODE.DECADE: setCurrentDate(moveDateByYear(currentDate, yearToRender, false)); break;
      default: console.warn("Mode not found"); break;
    }
  }
  function next() {
    switch (mode) {
      case VIEW_MODE.MONTH: setCurrentDate(moveDateByMonth(currentDate, 1, true)); break;
      case VIEW_MODE.YEAR: setCurrentDate(moveDateByYear(currentDate, 1, true)); break;
      case VIEW_MODE.DECADE: setCurrentDate(moveDateByYear(currentDate, yearToRender, true)); break;
      default: console.warn("Mode not found"); break;
    }
  }

  function zoomIn(date: Date) {
    if (currentDate.getTime() !== date.getTime()) {
      setCurrentDate(date)
    }
    switch (mode) {
      case VIEW_MODE.YEAR: setMode("month"); break;
      case VIEW_MODE.DECADE: setMode("year"); break;
      case VIEW_MODE.MONTH: console.warn("Can't zoom in more"); break;
      default: throw new Error("Invalid mode")
    }
  }


  function zoomOut() {
    switch (mode) {
      case VIEW_MODE.MONTH: setMode("year"); break;
      case VIEW_MODE.YEAR: setMode("decade"); break;
      case VIEW_MODE.DECADE: console.warn("Can't zoom out more"); break;
      default: throw new Error("Invalid mode")
    }
  }

  function getItemsToRender() {
    switch (mode) {
      case VIEW_MODE.MONTH: return getMonthItems(currentDate)
      case VIEW_MODE.YEAR: return getYearItems(currentDate)
      case VIEW_MODE.DECADE: return getDecadeItems(currentDate)
      default: return []
    }
  }
  function getMonthItems(currentDate: Date): DateUnit[] {
    const monthLength = getDaysInMonth(currentDate);
    const days: DateUnit[] = []
    for (let index = 0; index < monthLength; index++) {
      days.push({
        num: index + 1,
        type: "day",
        date: dateContructor(currentDate, { day: index + 1 }),
        inMonth: true,
        today: isToday(dateContructor(currentDate, { day: index + 1 }))
      })
    }
    if (options?.alignByWeek) {
      const firstDayWeek = days[0].date.getDay()
      const missingDayCount = weeks.indexOf(firstDayWeek as CalendarWeek)
      const daysToPrepend: DateUnit[] = []
      let prependigDay = days[0].date
      for (let index = 0; index < missingDayCount; index++) {
        prependigDay = moveDateByDay(prependigDay, 1, false)
        daysToPrepend.push({
          type: "day",
          date: prependigDay,
          inMonth: false,
          num: prependigDay.getDate(),
          today: isToday(dateContructor(currentDate, { day: index + 1 }))
        })
      }
      days.unshift(...daysToPrepend.reverse())
    }
    if (options?.appendDaysToFillRect) {
      const missingDays = Math.ceil(days.length / 7) * 7 - days.length;
      const daysToAppend: DateUnit[] = []
      let appendingDay = days[days.length - 1].date
      for (let index = 0; index < missingDays; index++) {
        appendingDay = moveDateByDay(appendingDay, 1, true)
        daysToAppend.push({
          type: "day",
          date: appendingDay,
          inMonth: false,
          num: appendingDay.getDate(),
          today: isToday(dateContructor(currentDate, { day: index + 1 }))
        })
      }
      days.push(...daysToAppend)
    }
    return days
  }

  function dateContructor(date: Date, { year, month, day }: { year?: number, month?: number, day?: number }) {
    const _year = year !== undefined ? year : date.getFullYear()
    const _month = month !== undefined ? month : date.getMonth()
    const _day = day !== undefined ? day : date.getDate()
    return new Date(_year, _month, _day)
  }


  function getYearItems(currentDate: Date): DateUnit[] {
    const months: DateUnit[] = []
    for (let index = 0; index < 12; index++) {
      months.push({
        num: index + 1,
        type: "month",
        date: dateContructor(currentDate, { month: index }),
        today: isToday(dateContructor(currentDate, { month: index }))
      })
    }
    return months
  }

  function getDecadeItems(currentDate: Date): DateUnit[] {
    const year = currentDate.getFullYear()
    const years: DateUnit[] = []
    for (let index = 0; index < yearToRender; index++) {
      years.push({
        num: year + index,
        type: "year",
        date: dateContructor(currentDate, { year: year + index }),
        today: isToday(dateContructor(currentDate, { year: year + index }))
      })
    }
    return years
  }

  const items: DateUnit[] = getItemsToRender()

  return { prev, next, items, mode, weeks, options, zoomIn, zoomOut, currentDate }
}


function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

