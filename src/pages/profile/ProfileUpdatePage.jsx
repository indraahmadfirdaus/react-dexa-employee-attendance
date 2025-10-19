import { useEffect, useState } from 'react'
import { Phone, Upload, Save, ArrowLeft, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth/authStore'
import { api } from '@/lib/api'
import { authService } from '@/services/authService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ProfileUpdatePage() {
  const authUser = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const [name, setName] = useState(authUser?.name || '—')
  const [position, setPosition] = useState(authUser?.position || '—')
  const [role, setRole] = useState(authUser?.role || '—')
  const [photoUrl, setPhotoUrl] = useState(authUser?.photoUrl || null)
  const [phone, setPhone] = useState(authUser?.phone || '')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile')
        const data = res?.data ?? res
        if (mounted) {
          setName(data?.name || '—')
          setPosition(data?.position || '—')
          setRole(data?.role || '—')
          setPhotoUrl(data?.photoUrl || null)
          const nextPhone = data?.phone || ''
          setPhone(nextPhone)
        }
      } catch (_) {
        if (mounted) {
          setName(authUser?.name || '—')
          setPosition(authUser?.position || '—')
          setRole(authUser?.role || '—')
          setPhotoUrl(authUser?.photoUrl || null)
          const nextPhone = authUser?.phone || ''
          setPhone(nextPhone)
        }
      }
    }
    fetchProfile()
    return () => { mounted = false }
  }, [authUser])

  const initials = (name || '—')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSave = async () => {
    setLoading(true)
    const tid = toast.loading('Updating profile...')
    try {
      await api.patch('/profile', { phone })
      toast.success('Profile updated', {
        id: tid,
        description: 'Phone number saved successfully',
      })
      navigate('/profile')
    } catch (err) {
      toast.error('Failed to update profile', {
        id: tid,
        description: err?.response?.data?.message || 'Please try again',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      handleUploadPhoto(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleUploadPhoto = async (fileParam) => {
    const file = fileParam || selectedFile
    if (!file) {
      toast.info('Please choose a photo first')
      return
    }
    setUploading(true)
    const tid = toast.loading('Uploading photo...')
    try {
      const form = new FormData()
      form.append('photo', file)
      const res = await api.post('/profile/upload-photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const data = res?.data ?? res
      const nextUrl = data?.photoUrl || data?.data?.photoUrl || photoUrl
      if (nextUrl) setPhotoUrl(nextUrl)
      toast.success('Photo uploaded', {
        id: tid,
        description: 'Profile photo updated successfully',
      })
    } catch (err) {
      toast.error('Failed to upload photo', {
        id: tid,
        description: err?.response?.data?.message || 'Please try again',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setChangingPassword(true)
    const tid = toast.loading('Changing password...')
    try {
      await authService.changePassword(currentPassword, newPassword)
      toast.success('Password changed', {
        id: tid,
        description: 'Your password has been updated successfully',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error('Failed to change password', {
        id: tid,
        description: err?.response?.data?.message || 'Please try again',
      })
    } finally {
      setChangingPassword(false)
    }
  }

  const goBack = () => navigate('/profile')

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* Hero header */}
      <div className="relative h-40 bg-black rounded-t-3xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-12 h-12 border-4 border-white transform rotate-45" />
          <div className="absolute top-10 right-8 w-10 h-10 bg-white rounded-full" />
          <div className="absolute bottom-5 left-10 w-16 h-16 border-4 border-white" />
          <div className="absolute bottom-6 right-6 w-6 h-6 bg-white transform rotate-12" />
                  <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
            <div className="w-7 h-7 bg-black rounded-lg" />
          </div>
        </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button variant="outline" onClick={goBack} className="h-9 rounded-xl bg-white text-black dark:bg-neutral-800 dark:text-neutral-100">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
      </div>

      {/* Update card */}
      <Card className="bg-white dark:bg-neutral-900 rounded-b-3xl shadow-xl dark:border dark:border-white/10">
        <CardHeader className="flex items-center gap-4">
          {(previewUrl || photoUrl) ? (
            <img
              src={previewUrl || photoUrl}
              alt={name}
              className="h-16 w-16 rounded-xl object-cover border-2 dark:border-white/20"
            />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-semibold border-2 border-green-500">
              {initials || '—'}
            </div>
          )}
          <div className="flex-1 text-center">
            <CardTitle className="text-xl dark:text-neutral-100">Update Profile</CardTitle>
            <CardDescription className="text-sm dark:text-neutral-300">{name} • {position} • {role}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-white/10">
              <Phone className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-neutral-400">Phone</div>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+628xxxxxxxxxx"
                  className="mt-1 h-9 rounded-lg dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:border-white/10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-white/10">
              <Upload className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-neutral-400">Profile Photo</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 text-sm dark:text-neutral-300"
                />
                <div className="mt-1 text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-1">
                  <Upload className="h-3 w-3 dark:text-neutral-300" />
                  <span>Select a file; photo uploads automatically</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
              <h3 className="font-semibold text-sm dark:text-neutral-100">Change Password</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-white/10">
                <Lock className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-neutral-400">Current Password</div>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="mt-1 h-9 rounded-lg dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:border-white/10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-white/10">
                <Lock className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-neutral-400">New Password</div>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-1 h-9 rounded-lg dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:border-white/10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-white/10">
                <Lock className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-neutral-400">Confirm New Password</div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-1 h-9 rounded-lg dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:border-white/10"
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              className="w-full mt-3 h-10 rounded-xl border bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
              disabled={changingPassword}
            >
              <Lock className="h-4 w-4" />
              <span>{changingPassword ? 'Changing Password...' : 'Change Password'}</span>
            </Button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 h-10 rounded-xl border bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}