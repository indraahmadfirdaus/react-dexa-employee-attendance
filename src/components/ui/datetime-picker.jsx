import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const DateTimePicker = forwardRef(({ id, name, label, value, onChange, type = 'date', className }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={id || name} className="text-xs text-gray-600">
          {label}
        </Label>
      )}
      <Input
        ref={ref}
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={cn('h-10 rounded-xl border-gray-200 focus:border-black', className)}
      />
    </div>
  )
})

DateTimePicker.displayName = 'DateTimePicker'

export { DateTimePicker }