import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { formatDate, formatTime } from '@/utils/format'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CalendarDays, LogIn, LogOut, MapPin, Loader2 } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { useSummary } from '@/hooks/useSummary'

export default function SummaryPage() {
  const [records, setRecords] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 10 })
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({ startDate: '', endDate: '' })

  const params = useMemo(() => ({
    page: meta.page,
    limit: meta.limit,
    ...(filters.startDate ? { startDate: filters.startDate } : {}),
    ...(filters.endDate ? { endDate: filters.endDate } : {}),
  }), [meta.page, meta.limit, filters.startDate, filters.endDate])

  const { data, isLoading, isFetching, isError, error: queryError, refetch } = useSummary({
    page: params.page,
    limit: params.limit,
    startDate: filters.startDate,
    endDate: filters.endDate,
  })

  useEffect(() => {
    if (isError) setError(queryError?.message || 'Failed to load summary')
    else setError(null)
    setRecords(data?.rows ?? [])
  }, [data, isError, queryError])

  const toIsoDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '')

  const handleDateChange = (key) => (date) => {
    const value = toIsoDate(date)
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const applyFilters = () => {
    setMeta((m) => ({ ...m, page: 1 }))
    refetch()
  }

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' })
    setMeta((m) => ({ ...m, page: 1 }))
  }

  const prevPage = () => {
    setMeta((m) => ({ ...m, page: Math.max(1, m.page - 1) }))
  }
  const nextPage = () => {
    setMeta((m) => ({ ...m, page: Math.min(m.totalPages, m.page + 1) }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Summary</h1>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>{filters.startDate || '—'} → {filters.endDate || '—'}</span>
        </div>
      </div>

      {/* Compact filters */}
      <div className="flex items-center justify-between gap-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <DatePicker
            id="startDate"
            name="startDate"
            label="From"
            value={filters.startDate}
            onChange={handleDateChange('startDate')}
            buttonClassName="h-8 px-3 text-sm"
            labelClassName="text-xs"
          />
          <DatePicker
            id="endDate"
            name="endDate"
            label="To"
            value={filters.endDate}
            onChange={handleDateChange('endDate')}
            buttonClassName="h-8 px-3 text-sm"
            labelClassName="text-xs"
          />
          <Button onClick={applyFilters} className="cursor-pointer px-4 bg-black hover:bg-gray-800 text-white rounded-xl">Apply</Button>
          <Button variant="outline" onClick={clearFilters} className="cursor-pointer px-3 rounded-lg text-sm whitespace-nowrap">Reset</Button>
        </div>
      </div>

      {/* Results */}
      {(isLoading || isFetching) && (
        <div className="flex items-center justify-center py-6 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading data…
        </div>
      )}
      {(error || isError) && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!isLoading && records.length === 0 && (
        <div className="text-sm text-gray-500">No data for this date range.</div>
      )}

      <div className="space-y-3">
        {records.map((r) => (
          <Card key={r.id} className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {formatDate(r.date || r.createdAt)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium">Clock In</span>
                  </div>
                  <div className="text-sm text-gray-900">
                    {r.clockIn ? formatTime(r.clockIn) : '—'}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 line-clamp-2 flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-[2px]" />
                    <span>{r.clockInAddress || '—'}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Clock Out</span>
                  </div>
                  <div className="text-sm text-gray-900">
                    {r.clockOut ? formatTime(r.clockOut) : '—'}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 line-clamp-2 flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-[2px]" />
                    <span>{r.clockOutAddress || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Status: <strong className={statusColor(r.status)}>{r.status || '—'}</strong></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-gray-500">Page {meta.page} of {data?.meta?.totalPages ?? 1}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={prevPage} disabled={meta.page <= 1} className="h-9 rounded-xl">Previous</Button>
          <Button variant="outline" onClick={nextPage} disabled={meta.page >= (data?.meta?.totalPages ?? 1)} className="h-9 rounded-xl">Next</Button>
        </div>
      </div>
    </div>
  )
}

function statusColor(status) {
  if (status === 'PRESENT') return 'text-green-600'
  if (status === 'ABSENT') return 'text-red-600'
  if (status === 'LATE') return 'text-orange-600'
  return 'text-gray-600'
}