import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useSummary({ page = 1, limit = 10, startDate, endDate }) {
  const params = {
    page,
    limit,
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  }

  return useQuery({
    queryKey: ['attendance-summary', page, limit, startDate, endDate],
    queryFn: async () => {
      const res = await api.get('/attendance/summary', { params })
      const body = res?.data ?? res
      const rows = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []
      const meta = body?.meta ?? { page, limit, total: rows.length, totalPages: 1 }
      return { rows, meta }
    },
    keepPreviousData: true,
  })
}