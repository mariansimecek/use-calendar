import { format } from "date-fns";
import { cs } from "date-fns/locale";
import Calendar from "./examples/calendar";
import { useCalendar } from "./libary/use-calendar";
function getDateFromWeekIndex(weekIndex: number) {
  const date = new Date()
  date.setDate(date.getDate() - date.getDay() + weekIndex)
  return date
}
function App() {
  const { prev, next, items, mode,  weeks, options, zoomIn, zoomOut, currentDate } = useCalendar({ alignByWeek: true, appendDaysToFillRect: true });
  return (
    <div>
      <Calendar/>
      {/* <div className="w-96"> */}
      {/*   <div className="flex justify-between "> */}
      {/*     <button className="btn py-4 px-6 bg-blue-400" onClick={() => { prev() }}>prev</button> */}
      {/*     <button onClick={() => { zoomOut() }}>{format(currentDate, 'E dd. MMMM yyyy', { locale: cs })}</button> */}
      {/*     <button className="btn py-4 px-6 bg-blue-400" onClick={() => { next() }}>next</button> */}
      {/*   </div> */}
      {/*   <div className={`grid ${mode === 'month' ? 'grid-cols-7' : 'grid-cols-6'}`}> */}
      {/*     {mode === 'month' && options?.alignByWeek && weeks.map((week) => ( */}
      {/*       <div className={`aspect-square flex items-center justify-center `}>{format(getDateFromWeekIndex(week), 'E', { locale: cs })}</div> */}
      {/*     ))} */}
      {/*     {items.map((date) => ( */}
      {/*       <div className={`aspect-square ${date.inMonth ? 'bg-zinc-300' : 'bg-zinc-100'} flex flex-col items-center justify-center hover:bg-zinc-400 cursor-pointer`} onClick={() => { zoomIn(date.date) }}> */}
      {/*         {mode === "month" && ( */}
      {/*           <> */}
      {/*             <span className="font-bold">{format(date.date, 'dd', { locale: cs })}</span> */}
      {/*             <span className="text-xs">{format(date.date, 'E', { locale: cs })}</span> */}
      {/*           </> */}
      {/*         )} */}
      {/*         {mode === "year" && ( */}
      {/*           <span className="font-bold">{format(date.date, 'MMM', { locale: cs })}</span> */}
      {/*         )} */}
      {/**/}
      {/*         {mode === "decade" && ( */}
      {/*           <span className="font-bold">{format(date.date, 'yyyy', { locale: cs })}</span> */}
      {/*         )} */}
      {/*       </div> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* </div> */}
      {/* <div> */}
      {/*   <span>Debug</span> */}
      {/*   <ul> */}
      {/*     <li>currentDate: {JSON.stringify(currentDate)}</li> */}
      {/*     <li>mode: {mode}</li> */}
      {/*     <li>options: {JSON.stringify(options)}</li> */}
      {/*   </ul> */}
      {/* </div> */}
    </div>
  )
}

export default App

