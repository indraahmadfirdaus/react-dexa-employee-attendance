import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export function Calendar({ selected, onSelect, mode = 'single', className = '', ...props }) {
  return (
    <div className={`rounded-xl p-2 ${className}`}>
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        showOutsideDays
        weekStartsOn={1}
        {...props}
      />
    </div>
  )
}