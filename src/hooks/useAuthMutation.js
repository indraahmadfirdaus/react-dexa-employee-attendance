import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth/authStore'
import { api } from '@/lib/api'

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth)

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/auth/login', payload)
      return res?.data ?? res
    },
    onSuccess: (data) => {
      const { user, token } = data || {}
      if (user && token) {
        setAuth(user, token)
      }
    },
  })

  const { mutate, reset, isPending, error, data } = mutation
  return { mutate, reset, isLoading: isPending, error, data }
}