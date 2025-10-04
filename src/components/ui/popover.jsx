import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

export function Popover({ children, ...props }) {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
}

export function PopoverTrigger({ children, ...props }) {
  return (
    <PopoverPrimitive.Trigger asChild {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  )
}

export function PopoverContent({ className = '', children, ...props }) {
  return (
    <PopoverPrimitive.Content
      sideOffset={4}
      className={`z-50 rounded-xl border bg-white p-2 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  )
}

export const PopoverPortal = PopoverPrimitive.Portal