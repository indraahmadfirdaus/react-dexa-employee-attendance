import * as React from 'react'
import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function formatEn(date) {
  if (!date) return ''
  try {
    return format(date, 'PPP')
  } catch {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

export function DatePicker({ id, name, label, value, onChange, buttonClassName = '', labelClassName = '', containerClassName = '' }) {
  const [date, setDate] = React.useState(value ? new Date(value) : undefined)

  React.useEffect(() => {
    if (value) setDate(new Date(value))
    else setDate(undefined)
  }, [value])

  const handleSelect = (d) => {
    // React DayPicker may return undefined to clear selection
    const next = d || undefined
    setDate(next)
    if (onChange) onChange(next)
  }

  return (
    <div className={cn('space-y-0.5', containerClassName)}>
      {label && (
        <Label htmlFor={id || name} className={cn('text-xs text-gray-700 dark:text-neutral-300', labelClassName)}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id || name}
            data-empty={!date}
            className={cn(
              'w-full h-8 text-sm rounded-lg justify-start text-left font-normal',
              'data-[empty=true]:text-muted-foreground',
              buttonClassName
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {date ? formatEn(date) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
    </div>
  )
}