import { useState } from "react"
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
  date: Date
  inMonth?: boolean
}
type CalendarWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const useCalendar = (options: UseCalendarOptions) => {
  const [currentDate, setCurrentDate] = useState(options?.initalDate || new Date())
  const [mode, setMode] = useState<CalendarMode>(options?.initalMode || "month")
  const yearToRender = options?.yearToRender || 14

  function moveDateByDay(date: Date, amount: number, direction: boolean): Date { }
  function moveDateByMonth(date: Date, amount: number, direction: boolean): Date { }
  function moveDateByYear(date: Date, amount: number, direction: boolean): Date { }

  function prev() {
    switch (mode) {
      case "month": setCurrentDate(moveDateByDay(currentDate, 1, false)); break;
      case "year": setCurrentDate(moveDateByMonth(currentDate, 12, false)); break;
      case "decade": setCurrentDate(moveDateByYear(currentDate, yearToRender, false)); break;
      default: console.warn("mode not found"); break;
    }
  }
  function next() {
    switch (mode) {
      case "month": setCurrentDate(moveDateByDay(currentDate, 1, true)); break;
      case "year": setCurrentDate(moveDateByMonth(currentDate, 12, true)); break;
      case "decade": setCurrentDate(moveDateByYear(currentDate, yearToRender, true)); break;
      default: console.warn("mode not found"); break;
    }
  }

  function zoomIn() {
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
      case "month": return getMonthItems()
      case "year": return getYearItems()
      case "decade": return getDecadeItems()
      default: return []
    }
  }
  function getMonthItems() {
    // generate month items
    // prepend if needed
    // append to fill rect if needed

    throw new Error("Function not implemented.")
  }

  function getYearItems() {
    throw new Error("Function not implemented.")
  }

  function getDecadeItems() {
    throw new Error("Function not implemented.")
  }

  const items:DateUnit[] = getItemsToRender()

  function getWeeks() {
    // get weeks and shift by weekStartsOn
    return [0, 1, 2, 3, 4, 5, 6] as CalendarWeek[]
  }
  const weeks: CalendarWeek[] = getWeeks()

  return { prev, next, items, mode, weeks, options, zoomIn, zoomOut, currentDate }
}




