import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useCalendar } from "./libary/use-calendar";

function App() {
  const { prev, next, items, mode, weeks, options, zoomIn, zoomOut, currentDate } = useCalendar({ alignByWeek: true, appendDaysToFillRect: true });
  return (
    <div>
      <div className="w-96">
        <div className="flex justify-between ">
          <button className="btn py-4 px-6 bg-blue-400" onClick={() => { prev() }}>prev</button>
          <button onClick={() => { zoomOut() }}>{JSON.stringify(currentDate)}</button>
          <button className="btn py-4 px-6 bg-blue-400" onClick={() => { next() }}>next</button>
        </div>
        <div className="grid grid-cols-7">
          {options?.alignByWeek && weeks.map((week) => (
            <div className={`aspect-square flex items-center justify-center `}>{week}</div>
          ))}
          {items.map((date) => (
            <div className={`aspect-square ${date.inMonth ? 'bg-zinc-300' : 'bg-zinc-100'} flex flex-col items-center justify-center hover:bg-zinc-300 cursor-pointer`} onClick={() => { zoomIn(date.date) }}>
                <span className="font-bold">{format(date.date, 'dd', { locale: cs })}</span>
                <span className="text-xs">{format(date.date, 'E', { locale: cs })}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span>Debug</span>
        <ul>
          <li>currentDate: {JSON.stringify(currentDate)}</li>
          <li>mode: {mode}</li>
          <li>options: {JSON.stringify(options)}</li>
        </ul>
      </div>
    </div>
  )
}

export default App

