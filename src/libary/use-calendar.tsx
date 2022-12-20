import { useEffect, useState } from "react"
//TODO: hour mode
//TODO: add useCallback and useMemo to optimize



interface UseCalendarOptions {
  initalDate?: Date
  initalMode?: CalendarMode
  weekStartsOn?: CalendarWeek
  minDate?: Date
  maxDate?: Date
  alignByWeek?: boolean
  appendDaysToFillRect?: boolean
  yearToRender?: number
}

type CalendarMode = "month" | "year" | "decade"

interface DateUnit {
  num: number,
  type: "day" | "month" | "year"
  date: Date
  inMonth?: boolean
}
type CalendarWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const useCalendar = (options: UseCalendarOptions) => {
  const [currentDate, setCurrentDate] = useState(options?.initalDate || new Date())
  const [mode, setMode] = useState<CalendarMode>(options?.initalMode || "month")
  const yearToRender = options?.yearToRender || 14

  function moveDateByDay(date: Date, amount: number, direction: boolean): Date {
    return new Date(date.setDate(date.getDate() + (direction ? amount : -amount)))
  }
  function moveDateByMonth(date: Date, amount: number, direction: boolean): Date {
    return new Date(date.setMonth(date.getMonth() + (direction ? amount : -amount)))
  }
  function moveDateByYear(date: Date, amount: number, direction: boolean): Date {
    return new Date(date.setFullYear(date.getFullYear() + (direction ? amount : -amount)))
  }

  function prev() {
    switch (mode) {
      case "month": setCurrentDate(moveDateByMonth(currentDate, 1, false)); break;
      case "year": setCurrentDate(moveDateByYear(currentDate, 1, false)); break;
      case "decade": setCurrentDate(moveDateByYear(currentDate, yearToRender, false)); break;
      default: console.warn("Mode not found"); break;
    }
  }
  function next() {
    switch (mode) {
      case "month": setCurrentDate(moveDateByMonth(currentDate, 1, true)); break;
      case "year": setCurrentDate(moveDateByYear(currentDate, 1, true)); break;
      case "decade": setCurrentDate(moveDateByYear(currentDate, yearToRender, true)); break;
      default: console.warn("Mode not found"); break;
    }
  }

  function zoomIn(date: Date) {
    setCurrentDate(date)
    switch (mode) {
      case "year": setMode("month"); break;
      case "decade": setMode("year"); break;
      case "month": console.warn("Can't zoom in more"); break;
      default: throw new Error("Invalid mode")
    }
  }

  function zoomOut() {
    switch (mode) {
      case "month": setMode("year"); break;
      case "year": setMode("decade"); break;
      case "decade": console.warn("Can't zoom out more"); break;
      default: throw new Error("Invalid mode")
    }
  }

  function getItemsToRender() {
    switch (mode) {
      case "month": return getMonthItems(currentDate)
      case "year": return getYearItems(currentDate)
      case "decade": return getDecadeItems(currentDate)
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
        inMonth: true
      })
    }
    if (options.alignByWeek) {
      const firstDay = days[0].date.getDay()
      const missingDaysCount = firstDay - (options.weekStartsOn || 0)

      const daysToPrepend: DateUnit[] = []
      let prependigDay = currentDate
      for (let index = 0; index < missingDaysCount; index++) {
        prependigDay = moveDateByDay(prependigDay, 1, false)
        daysToPrepend.push({
          type: "day",
          date: prependigDay,
          inMonth: false,
          num: prependigDay.getDate()
        })
        days.unshift(...daysToPrepend)
      }
    }
    if (options.appendDaysToFillRect) {
      const fillCount = Math.ceil((days.length / 7) * 7 - days.length)
      console.log(fillCount)
      const daysToAppend: DateUnit[] = []
      let appendingDay = currentDate
      for (let index = 0; index < fillCount; index++) {
        appendingDay = moveDateByDay(appendingDay, 1, true)
        daysToAppend.push({
          type: "day",
          date: appendingDay,
          inMonth: false,
          num: appendingDay.getDate()
        })
      }
      days.push(...daysToAppend)
    }
    return days
  }

  function dateContructor(date: Date, { year, month, day }: { year?: number, month?: number, day?: number }) {
    return new Date(year || date.getFullYear(), month || date.getMonth(), day || date.getDate())
  }
  function getYearItems(currentDate: Date): DateUnit[] {
    const months: DateUnit[] = []
    for (let index = 0; index < 12; index++) {
      months.push({
        num: index + 1,
        type: "month",
        date: dateContructor(currentDate, { month: index })
      })
    }
    console.log(months)
    return months
  }

  function getDecadeItems(currentDate: Date): DateUnit[] {
    const year = currentDate.getFullYear()
    const years: DateUnit[] = []
    for (let index = 0; index < yearToRender; index++) {
      years.push({
        num: year + index,
        type: "year",
        date: dateContructor(currentDate, { year: year + index })
      })
    }
    return years
  }

  const items: DateUnit[] = getItemsToRender()

  function getWeeks() {
    // get weeks and shift by weekStartsOn
    return [0, 1, 2, 3, 4, 5, 6] as CalendarWeek[]
  }
  const weeks: CalendarWeek[] = getWeeks()

  return { prev, next, items, mode, weeks, options, zoomIn, zoomOut, currentDate }
}




function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

