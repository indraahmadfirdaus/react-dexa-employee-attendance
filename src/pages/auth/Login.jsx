import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useLoginMutation } from '@/hooks/useAuthMutation'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { mutate, isLoading } = useLoginMutation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await mutate(formData, {
        onSuccess: ({ user }) => {
          toast.success('Welcome back!', {
            description: `You’re signed in, ${user.name}. Time to clock in.`,
          })
          navigate('/attendance')
        },
        onError: (error) => {
          toast.error('Login failed', {
            description: error.response?.data?.message || 'Invalid credentials',
          })
        },
      })
    } catch (err) {
      // Error handling is done in onError; no-op here
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="relative h-48 bg-black rounded-t-3xl overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white transform rotate-45" />
            <div className="absolute top-12 right-8 w-12 h-12 bg-white rounded-full" />
            <div className="absolute bottom-6 left-12 w-20 h-20 border-4 border-white" />
            <div className="absolute bottom-8 right-6 w-8 h-8 bg-white transform rotate-12" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-black rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Sign In to Attendance</h1>
          <p className="text-sm text-gray-600 text-center">Clock in, clock out, and view your attendance.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-600">
                Work Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-xl border-gray-200 focus:border-black transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-600">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="• • • • • • • •"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-gray-200 focus:border-black transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-medium text-base transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Need an account? <span className="text-black font-medium hover:underline">Contact HR to get set up.</span>
          </p>
        </div>
      </div>
    </div>
  )
}