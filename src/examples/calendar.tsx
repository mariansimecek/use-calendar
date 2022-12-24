import { format } from 'date-fns';
import { useCalendar } from '../libary/use-calendar';

const Calendar = () => {
  const { prev, next, items, mode, weeks, options, zoomIn, zoomOut, currentDate } = useCalendar({ alignByWeek: true, appendDaysToFillRect: true });

  return (
    <div className='w-[400px]'>
      <div className='flex justify-between items-center'>
        <button></button>
      </div>
      <div className='grid grid-cols-7 '>
        {items.map((d, index) => (
          <div key={index} className={`first:rounded-tl-2xl last:rounded-br-2xl border-r border-b border-solid  p-4 aspect-square ${d.inMonth ? 'border-zinc-500 text-zinc-500' : 'border-zinc-300 text-zinc-300'}`}>{format(d.date, 'dd')}</div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
