import { useQuery } from '@tanstack/react-query'
import { fetchCalendarEvents, fetchChecklist } from '../api'

type ChecklistPanelProps = {
  selectedDay: number | null
  onClose: () => void
}

function ChecklistPanel({ selectedDay, onClose }: ChecklistPanelProps) {
  const isOpen = selectedDay !== null

  const { data: events } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: fetchCalendarEvents,
  })

  const month = 4 // May
  const dayEvent = events?.find((e) => {
    const eventDate = new Date(e.event_date)
    return selectedDay !== null && eventDate.getDate() === selectedDay && eventDate.getMonth() === month
  })

  const subsystemId = dayEvent?.subsystem_id

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['checklist', subsystemId],
    queryFn: () => fetchChecklist(subsystemId!),
    enabled: !!subsystemId, // only fetch once we actually have a subsystem
  })

  return (
    <div className={`panel-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{dayEvent ? dayEvent.calendar_label : 'No maintenance scheduled'}</h2>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>

        {isLoading && <p className="panel-empty">Loading tasks...</p>}
        {!dayEvent && <p className="panel-empty">No checklist tasks for this date.</p>}
        {dayEvent && !isLoading && tasks?.length === 0 && (
          <p className="panel-empty">No checklist tasks found for this subsystem.</p>
        )}

        {tasks?.map((task) => (
          <div key={task.task_id} className="task-card">
            <div className="task-title">{task.task_title}</div>
            <div className="task-description">{task.task_description}</div>
            <div className="task-meta">
              <span>{task.approx_time_min} min</span>
              <span>{task.special_tools}</span>
              <span>{task.ppe_requirements}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChecklistPanel