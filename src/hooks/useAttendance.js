import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const attendanceQueryKeys = {
  today: ['attendance', 'today'],
}

export function useTodayAttendance(options = {}) {
  const { staleTime = 60 * 1000, ...rest } = options

  return useQuery({
    queryKey: attendanceQueryKeys.today,
    queryFn: async () => {
      const res = await api.get('/attendance/today')
      // api returns response.data directly via interceptor
      return res?.data || null
    },
    staleTime,
    ...rest,
  })
}