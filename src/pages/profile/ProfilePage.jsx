import { useEffect, useState } from 'react'
import { Mail, Phone, Briefcase, CalendarDays, RefreshCw, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth/authStore'
import { api } from '@/lib/api'
import { formatDate } from '@/utils/format'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ProfilePage() {
  const authUser = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser?.name || '—')
  const [position, setPosition] = useState(authUser?.position || '—')
  const [email, setEmail] = useState(authUser?.email || '—')
  const [phone, setPhone] = useState(authUser?.phone || '—')
  const [role, setRole] = useState(authUser?.role || '—')
  const [photoUrl, setPhotoUrl] = useState(authUser?.photoUrl || null)
  const [createdAt, setCreatedAt] = useState(authUser?.createdAt || null)
  const [updatedAt, setUpdatedAt] = useState(authUser?.updatedAt || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchProfile = async () => {
      setLoading(true)
      try {
        // Try fetching the current user profile; fall back to auth store
        const res = await api.get('/profile')
        const data = res?.data ?? res
        if (mounted) {
          setName(data?.name || '—')
          setPosition(data?.position || '—')
          setEmail(data?.email || '—')
          setPhone(data?.phone || '—')
          setRole(data?.role || '—')
          setPhotoUrl(data?.photoUrl || null)
          setCreatedAt(data?.createdAt || null)
          setUpdatedAt(data?.updatedAt || null)
        }
      } catch (err) {
        if (mounted) {
          setName(authUser?.name || '—')
          setPosition(authUser?.position || '—')
          setEmail(authUser?.email || '—')
          setPhone(authUser?.phone || '—')
          setRole(authUser?.role || '—')
          setPhotoUrl(authUser?.photoUrl || null)
          setCreatedAt(authUser?.createdAt || null)
          setUpdatedAt(authUser?.updatedAt || null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProfile()
    return () => { mounted = false }
  }, [authUser])

  // fields are managed via component state

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const res = await api.get('/profile')
      const data = res?.data ?? res
      setName(data?.name || '—')
      setPosition(data?.position || '—')
      setEmail(data?.email || '—')
      setPhone(data?.phone || '—')
      setRole(data?.role || '—')
      setPhotoUrl(data?.photoUrl || null)
      setCreatedAt(data?.createdAt || null)
      setUpdatedAt(data?.updatedAt || null)
    } catch (err) {
      setName(authUser?.name || '—')
      setPosition(authUser?.position || '—')
      setEmail(authUser?.email || '—')
      setPhone(authUser?.phone || '—')
      setRole(authUser?.role || '—')
      setPhotoUrl(authUser?.photoUrl || null)
      setCreatedAt(authUser?.createdAt || null)
      setUpdatedAt(authUser?.updatedAt || null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    const toastId = toast.loading('Logging out...')
    try {
      logout()
      navigate('/login')
      toast.success('Logged Out Successfully!', {
        id: toastId,
        description: 'See you next time!',
      })
    } catch (err) {
      toast.error('Failed to logout', {
        id: toastId,
        description: 'Please try again',
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* Geometric hero inspired by Login, tuned to green */}
      <div className="relative h-40 bg-black rounded-t-3xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-12 h-12 border-4 border-white transform rotate-45" />
          <div className="absolute top-10 right-8 w-10 h-10 bg-white rounded-full" />
          <div className="absolute bottom-5 left-10 w-16 h-16 border-4 border-white" />
          <div className="absolute bottom-6 right-6 w-6 h-6 bg-white transform rotate-12" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
            <div className="w-7 h-7 bg-black rounded-lg" />
          </div>
        </div>
      </div>

      {/* Profile card */}
      <Card className="bg-white rounded-b-3xl shadow-xl">
        <CardHeader className="flex items-center gap-4">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-16 w-16 rounded-xl object-cover border-2"
            />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-semibold border-2 border-green-500">
              {initials || '—'}
            </div>
          )}
          <div className="flex-1 text-center">
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription className="text-sm">{position}</CardDescription>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 text-xs font-medium px-2 py-1 border border-green-200">
                {role}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <InfoRow icon={Mail} label="Email" value={email} />
            <InfoRow icon={Phone} label="Phone" value={phone} />
            <InfoRow icon={Briefcase} label="Position" value={position} />
          </div>

          {loading && (
            <div className="text-center text-xs text-gray-500">Loading profile…</div>
          )}

          <div className="mt-2 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Update Profile</span>
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 h-10 rounded-xl border bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
      <Icon className="h-4 w-4 text-gray-600" />
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value || '—'}</div>
      </div>
    </div>
  )
}

function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
      <Icon className="h-4 w-4 text-gray-600" />
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  )
}