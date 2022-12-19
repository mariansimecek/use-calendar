import { useCalendar } from "./libary/use-calendar";

function App() {
  const { prev, next, items, mode, weeks, options, zoomIn, zoomOut, currentDate } = useCalendar({});
  return (
    <div>
      <div>
        <button onClick={() => { prev() }}>prev</button>
        <button onClick={() => { zoomOut() }}>{JSON.stringify(currentDate)}</button>
        <button onClick={() => { next() }}>next</button>
        <div>
          {options?.alignByWeek && weeks.map((week) => (
            <div>{week}</div>
          ))}
          {items.map((date) => (
            <div onClick={() => { zoomIn() }}>{date.num}</div>
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

