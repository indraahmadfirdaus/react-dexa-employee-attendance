import { useState, useEffect, useRef } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useTodayAttendance } from '@/hooks/useAttendance'
import { useLocationStore } from '@/store/location/locationStore'
import AnalogClock from '@/components/attendance/AnalogClock'
import ThemeToggle from '@/components/ui/theme-toggle'
import ClockButton from '@/components/attendance/ClockButton'
import LocationPermissionDialog from '@/components/attendance/LocationPermissionDialog'
import { formatDate } from '@/utils/format'
import { MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [locationText, setLocationText] = useState('Please allow permission for location info')
  const permissionCheckedRef = useRef(false)
  
  const { hasPermission, location } = useLocationStore()
  const { requestPermission, getCurrentLocation } = useGeolocation()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (permissionCheckedRef.current) return
    permissionCheckedRef.current = true

    const checkPermission = async () => {
      const granted = await requestPermission()
      if (granted) {
        try {
          await getCurrentLocation()
        } catch (_) {
          // location errors handled inside hook
        }
      }
      setLoading(false)
    }
    checkPermission()
  }, [requestPermission, getCurrentLocation])

  const { data: todayAttendance, isLoading: todayLoading, error: todayError } = useTodayAttendance({
    onError: (error) => {
      toast.error('Failed to load today attendance', {
        description: error?.response?.data?.message || 'Please try again later',
      })
    },
  })

  const truncate = (text, max = 25) => {
    if (!text) return null
    const t = String(text).trim()
    return t.length > max ? `${t.slice(0, max)}...` : t
  }

  useEffect(() => {
    if (!hasPermission) {
      setLocationText('Please allow permission for location info')
      return
    }
    if (hasPermission && !location) {
      setLocationText('Locating…')
      return
    }
    const addr = truncate(location?.address)
    const lat = Number(location?.latitude)
    const lon = Number(location?.longitude)
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lon)
    const coordsText = hasCoords ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : null
    setLocationText(addr || coordsText || 'Location unavailable')
  }, [hasPermission, location])
  const clockInNotes = ''
  const clockOutNotes = ''

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-200">
          <MapPin size={20} className="" />
          <span className="text-sm font-medium">{locationText}</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="text-center mb-2">
        <p className="text-gray-500 dark:text-gray-300 text-sm">
          {formatDate(currentTime)}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center mb-4">
        <AnalogClock time={currentTime} />
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-1">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
        {/* <div className="flex items-center justify-center gap-2 text-primary text-sm">
          <MapPin size={16} />
          <span>{todayAttendance?.clockInAddress || 'Not clocked in yet'}</span>
        </div> */}
      </div>

      <ClockButton
        attendance={todayAttendance}
        clockInNotes={clockInNotes}
        clockOutNotes={clockOutNotes}
      />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Status: {todayAttendance?.clockOut ? (
            <span className="text-black-800 font-medium">Clocked Out</span>
          ) : todayAttendance?.clockIn ? (
            <span className="text-green-600 font-medium">Clocked In</span>
          ) : (
            <span className="text-red-600 font-medium">Not clocked in yet</span>
          )}
        </p>
      </div>

      {!loading && <LocationPermissionDialog />}
    </div>
  )
}