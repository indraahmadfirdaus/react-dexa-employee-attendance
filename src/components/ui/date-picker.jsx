import * as React from 'react'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function formatEn(date) {
  if (!date) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function DatePicker({ id, name, label, value, onChange, buttonClassName = '', labelClassName = '', containerClassName = '' }) {
  const [date, setDate] = React.useState(value ? new Date(value) : undefined)

  React.useEffect(() => {
    if (value) setDate(new Date(value))
    else setDate(undefined)
  }, [value])

  const handleSelect = (d) => {
    setDate(d)
    if (onChange) onChange(d)
  }

  return (
    <div className={`space-y-0.5 ${containerClassName}`}>
      {label && (
        <Label htmlFor={id || name} className={`text-xs text-gray-700 ${labelClassName}`}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id || name}
            className={`w-full justify-start rounded-lg h-8 text-sm ${buttonClassName}`}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {date ? formatEn(date) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
    </div>
  )
}