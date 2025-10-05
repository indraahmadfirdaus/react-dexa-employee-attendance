import { useState } from 'react'
import axios from 'axios'
import { useLocationStore } from '../store/location/locationStore'

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const { setLocation, setPermission, setError } = useLocationStore()

  const requestPermission = async () => {
    try {
      if (!navigator.geolocation) {
        setError('Geolocation not supported')
        return false
      }

      const result = await navigator.permissions.query({ name: 'geolocation' })
      const granted = result.state === 'granted'
      setPermission(granted)
      return granted
    } catch (err) {
      setError('Permission request failed')
      return false
    }
  }

  const fallbackBaseUrl = 'https://geocode.maps.co'

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const fb = await axios.get(`${fallbackBaseUrl}/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
        },
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000,
      })
      const data = fb?.data ?? {}
      const address = data.display_name || null
      const addressDetails = data.address || null
      return { address, addressDetails, raw: data }
    } catch (_) {
        setError('Reverse geocoding failed')
        return { address: null, addressDetails: null, raw: null }
      }
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const baseLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }

          // Attempt reverse geocoding (primary: geocode.maps.co, fallback: Nominatim)
          let enrichedLocation = baseLocation
          try {
            const rg = await reverseGeocode(baseLocation.latitude, baseLocation.longitude)
            enrichedLocation = {
              ...baseLocation,
              address: rg.address,
              addressDetails: rg.addressDetails,
            }
          } catch (_) {
            // reverse geocoding error already handled via setError
          }

          setLocation(enrichedLocation)
          setPermission(true)
          setLoading(false)
          resolve(enrichedLocation)
        },
        (error) => {
          setError(error.message)
          setPermission(false)
          setLoading(false)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  return { loading, requestPermission, getCurrentLocation, reverseGeocode }
}