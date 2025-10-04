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
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-md p-5 sm:p-6 rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-base sm:text-lg">
            Enable Location Access
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm">
            We need your location to verify your attendance. Your location will only be used during clock in/out.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <Button onClick={handleAllow} className="w-full h-11 text-sm">
            Allow Location
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full h-11 text-sm"
          >
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}