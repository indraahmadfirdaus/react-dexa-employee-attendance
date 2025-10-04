import { useEffect, useState } from 'react'
import { useLocationStore } from '@/store/location/locationStore'
import { useGeolocation } from '@/hooks/useGeolocation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

export default function LocationPermissionDialog() {
  const [open, setOpen] = useState(false)
  const { hasPermission } = useLocationStore()
  const { requestPermission, getCurrentLocation } = useGeolocation()

  useEffect(() => {
    // Show dialog if permission not granted
    if (!hasPermission) {
      setOpen(true)
    }
  }, [hasPermission])

  const handleAllow = async () => {
    // Trigger the browser's permission prompt by requesting current location
    try {
      await getCurrentLocation()
      setOpen(false)
    } catch (err) {
      // Keep dialog open if denied or failed; user can try again later
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-md p-5 sm:p-6 rounded-2xl dark:bg-neutral-900 dark:text-neutral-100 dark:border dark:border-white/10">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800">
            <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-gray-700 dark:text-neutral-200" />
          </div>
          <DialogTitle className="text-center text-base sm:text-lg dark:text-neutral-100">
            Enable Location Access
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm dark:text-neutral-300">
            We need your location to verify your attendance. Your location will only be used during clock in/out.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <Button
            onClick={handleAllow}
            className="w-full h-11 text-sm bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300 focus-visible:ring-neutral-400 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300 dark:border-white/10 dark:focus-visible:ring-neutral-400"
          >
            Allow Location
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full h-11 text-sm border-gray-300 text-gray-900 hover:bg-gray-100 focus-visible:ring-neutral-400 dark:text-neutral-100 dark:border-white/10 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400"
          >
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}