export function getDateFromWeekIndex(weekIndex: number) {
  const date = new Date()
  date.setDate(date.getDate() - date.getDay() + weekIndex)
  return date
}
