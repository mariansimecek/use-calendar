import { IconArrowLeft, IconArrowRight } from '@tabler/icons';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { getDateFromWeekIndex } from '../helpers/getDateFromWeekIndex';
import { useCalendar } from '../libary/use-calendar';

const Calendar = () => {
  const { prev, next, items, mode, weeks, options, zoomIn, zoomOut, currentDate } = useCalendar({ yearsToRender: 12, alignByWeek: true, appendDaysToFillRect: true, weekStartsOn: 1 });

  return (
    <div className='w-[400px] m-10'>
      <div className='flex justify-between items-center py-3'>
        <button className='p-3 rounded-full text-zinc-600 hover:text-zinc-800 hover:bg-gray-300 transition-colors' onClick={() => { prev() }}><IconArrowLeft /></button>
        <button onClick={() => { zoomOut() }}>{format(currentDate, 'EEEE dd. MMMM yyyy', { locale: cs })}</button>
        <button className='p-3 rounded-full text-zinc-600 hover:text-zinc-800 hover:bg-gray-300 transition-colors' onClick={() => { next() }}><IconArrowRight /></button>
      </div>
      <div className='grid grid-cols-7'>
        {mode === 'month' && options?.alignByWeek && weeks.map((week, index) => (
          <div key={index} className={`p-4 aspect-square`}>{format(getDateFromWeekIndex(week), 'EEE', { locale: cs })}</div>
        ))}
      </div>
      <div className={`grid ${mode === 'month' ? 'grid-cols-7' : 'grid-cols-6'} gap-[1px] bg-gray-200 shadow-md border-[1px] border-gray-200`}>
        {items.map((d, index) => (
          <div key={index} onClick={() => { zoomIn(d.date) }} className={`p-4 relative cursor-pointer aspect-square flex justify-center items-center ${d.inMonth ? 'bg-white text-zinc-600 hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100 text-zinc-400'} ${d.today && 'after:content-[""] after:bg-purple-700 after:absolute after:w-3 after:h-3 after:rounded-full after:top-2 after:right-2 '}`}>
            {mode === 'month' && (<span>{format(d.date, 'dd')}</span>)}
            {mode === 'year' && (<span>{format(d.date, 'MMM', { locale: cs })}</span>)}
            {mode === 'decade' && (<span>{format(d.date, 'yyyy')}</span>)}
          </div>
        ))}
      </div>
    </div >
  )
}

export default Calendar
