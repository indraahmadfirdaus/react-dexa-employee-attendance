import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGeolocation } from '@/hooks/useGeolocation'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useQueryClient } from '@tanstack/react-query'

export default function ClockButton({ attendance, notes, clockInNotes, clockOutNotes }) {
  const [loading, setLoading] = useState(false)
  const { getCurrentLocation } = useGeolocation()
  const queryClient = useQueryClient()

  const isClockedIn = attendance?.clockIn && !attendance?.clockOut

  const handleClockIn = async () => {
    setLoading(true)
    const toastId = toast.loading('Getting your location...')

    try {
      // Get location
      const location = await getCurrentLocation()

      // Call API
      const response = await api.post('/attendance/clock-in', {
        latitude: location.latitude,
        longitude: location.longitude,
        ...((clockInNotes ?? notes) ? { notes: (clockInNotes ?? notes) } : {}),
      })

      // Success
      toast.success('Clocked In Successfully!', {
        id: toastId,
        description: 'Have a productive day!',
      })

      // Confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Refresh today's attendance via React Query
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] })

    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || 'Please try again'
      if (status === 409) {
        toast.error('Already clocked in today', {
          id: toastId,
          description: message,
        })
      } else {
        toast.error('Failed to clock in', {
          id: toastId,
          description: message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClockOut = async () => {
    setLoading(true)
    const toastId = toast.loading('Getting your location...')

    try {
      const location = await getCurrentLocation()

      {
        const outNotes = clockOutNotes ?? notes
        await api.post('/attendance/clock-out', {
          latitude: location.latitude,
          longitude: location.longitude,
          ...(outNotes !== undefined ? { notes: outNotes } : {}),
        })
      }

      toast.success('Clocked Out Successfully!', {
        id: toastId,
        description: 'Great work today!',
      })

      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] })

    } catch (error) {
      toast.error('Failed to clock out', {
        id: toastId,
        description: error.response?.data?.message || 'Please try again',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      <Button
        onClick={isClockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        className={`w-full h-16 text-lg font-semibold rounded-2xl shadow-lg transition-all ${
          isClockedIn
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Clock className="mr-2 h-5 w-5" />
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </>
        )}
      </Button>

      {isClockedIn && attendance?.clockIn && (
        <p className="text-center text-sm text-gray-500 mt-3">
          Clocked in at {new Date(attendance.clockIn).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </p>
      )}
    </motion.div>
  )
}