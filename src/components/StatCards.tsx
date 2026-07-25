import { useQuery } from '@tanstack/react-query'
import { fetchSummary } from '../api'

type StatCardsProps = {
  selectedDay: number | null
}

function StatCards({ selectedDay }: StatCardsProps) {
  const year = 2026
  const month = 4 // May

  const dateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary', dateStr],
    queryFn: () => fetchSummary(dateStr!),
    enabled: !!dateStr,
  })

  if (!selectedDay) {
    return <p className="stat-cards-empty">Select a date to see maintenance summary.</p>
  }

  if (isLoading) {
    return <p className="stat-cards-empty">Loading summary...</p>
  }

  return (
    <div className="stat-cards">
      <div className="stat-card">
        <div className="stat-label">Planned Checks Today</div>
        <div className="stat-value">{summary?.planned_checks_today}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Estimated Maintenance Time</div>
        <div className="stat-value">{summary?.estimated_maintenance_hours}h</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Subsystems Eligible</div>
        <div className="stat-value">{summary?.subsystems_eligible}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Status</div>
        <div className="stat-value">{summary?.status_percentage}%</div>
      </div>
    </div>
  )
}

export default StatCards