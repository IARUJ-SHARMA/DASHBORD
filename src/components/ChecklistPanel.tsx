import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { fetchChecklist, updateTaskStatus, type ChecklistTask } from '../api'

type ChecklistPanelProps = {
  subsystemId: string | null
  subsystemLabel: string | null
}

function ChecklistPanel({ subsystemId, subsystemLabel }: ChecklistPanelProps) {
  const queryClient = useQueryClient()

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
    <div className="checklist-panel">
      <div className="panel-header">
        <h2>{subsystemLabel || 'No maintenance scheduled'}</h2>
      </div>

      {isLoading && <p className="panel-empty">Loading tasks...</p>}
      {!subsystemId && <p className="panel-empty">Select a date and subsystem to view its checklist.</p>}
      {subsystemId && !isLoading && tasks?.length === 0 && (
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
  )
}

export default ChecklistPanel