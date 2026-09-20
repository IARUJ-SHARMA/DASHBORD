import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { fetchChecklist, updateTaskStatus, type ChecklistTask } from '../api'

type ChecklistPanelProps = {
  subsystemId: string | null
  subsystemLabel: string | null
}

type GatekeepingData = {
  has_warning: boolean
  low_stock_items: string[]
}

function ChecklistPanel({ subsystemId, subsystemLabel }: ChecklistPanelProps) {
  const queryClient = useQueryClient()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['checklist', subsystemId],
    queryFn: () => fetchChecklist(subsystemId!),
    enabled: !!subsystemId,
  })

  // Fetch inventory gatekeeping warning status for the selected subsystem
  const { data: gatekeeping } = useQuery<GatekeepingData>({
    queryKey: ['gatekeeping', subsystemId],
    queryFn: async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/gatekeeping/${subsystemId}`)
      if (!res.ok) throw new Error('Failed to fetch gatekeeping status')
      return res.json()
    },
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

      {/* Inventory Warning Banner */}
      {gatekeeping?.has_warning && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ffeeba' }}>
          <strong>⚠️ Inventory Warning:</strong> Low-stock consumables detected for this subsystem:
          <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
            {gatekeeping.low_stock_items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

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