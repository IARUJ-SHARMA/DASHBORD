import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { fetchCalendarEvents, fetchChecklist, updateTaskStatus, type ChecklistTask } from '../api'

type ChecklistPanelProps = {
  year: number
  month: number
  selectedDay: number | null
  onClose: () => void
}

function ChecklistPanel({ year, month, selectedDay, onClose }: ChecklistPanelProps) {
  const isOpen = selectedDay !== null
  const queryClient = useQueryClient()

  const { data: events } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: fetchCalendarEvents,
  })

  const dayEvent = events?.find((e) => {
    const eventDate = new Date(e.event_date)
    return selectedDay !== null && eventDate.getDate() === selectedDay && eventDate.getMonth() === month && eventDate.getFullYear() === year
  })

  const subsystemId = dayEvent?.subsystem_id

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['checklist', subsystemId],
    queryFn: () => fetchChecklist(subsystemId!),
    enabled: !!subsystemId,
  })

  const mutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus(taskId, status),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<ChecklistTask[]>(['checklist', subsystemId], (old) =>
        old?.map((t) => (t.task_id === updatedTask.task_id ? updatedTask : t))
      )
    },
  })

  function toggleComplete(task: ChecklistTask) {
    const newStatus = task.completion_status === 'COMPLETE' ? 'PENDING' : 'COMPLETE'
    mutation.mutate({ taskId: task.task_id, status: newStatus })
  }

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
          <div
            key={task.task_id}
            className={`task-card ${task.completion_status === 'COMPLETE' ? 'task-complete' : ''}`}
          >
            <div className="task-card-header">
              <input
                type="checkbox"
                checked={task.completion_status === 'COMPLETE'}
                onChange={() => toggleComplete(task)}
              />
              <div className="task-title">{task.task_title}</div>
            </div>
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