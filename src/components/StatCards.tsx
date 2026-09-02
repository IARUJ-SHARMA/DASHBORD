import { useQuery } from '@tanstack/react-query'
import { fetchSummary } from '../api'
import StatusGauge from './StatusGauge'

type StatCardsProps = {
  year: number
  month: number
  selectedDay: number | null
}

function StatCards({ year, month, selectedDay }: StatCardsProps) {
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
        <div className="stat-label">Status (Completed Today)</div>
        <StatusGauge percentage={summary?.status_percentage ?? 0} />
      </div>
      <div className="stat-card stat-card-small">
        <div className="stat-label">Low Stock Alerts</div>
        <div className="stat-value">{summary?.low_stock_alerts}</div>
      </div>
      <div className="stat-card stat-card-small">
        <div className="stat-label">Life Span Alerts</div>
        <div className="stat-value">{summary?.life_span_alerts}</div>
      </div>
      <div className="stat-card stat-card-small">
        <div className="stat-label">Active Subsystems</div>
        <div className="stat-value">{summary?.total_active_subsystems}</div>
      </div>
      <div className="stat-card stat-card-small">
        <div className="stat-label">PM Completion (MTD)</div>
        <div className="stat-value">{summary?.pm_completion_rate_mtd}%</div>
      </div>
    </div>
  )
}

export default StatCards