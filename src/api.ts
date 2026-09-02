const BASE_URL = 'http://127.0.0.1:8000'

export type CalendarEvent = {
  id: number
  event_date: string
  day_of_week: string
  subsystem_id: string
  subsystem_name: string
  pm_frequency: string
  colour_code: string
  duration_hrs: number
  calendar_label: string | null
}

export type ChecklistTask = {
  task_id: string
  step_no: number | null
  task_title: string
  task_description: string | null
  approx_time_min: number | null
  special_tools: string | null
  ppe_requirements: string | null
  video_ref_filename: string | null
  image_ref_filename: string | null
  mandatory_flag: string | null
  completion_status?: string | null
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(`${BASE_URL}/api/calendar-events`)
  if (!res.ok) throw new Error('Failed to fetch calendar events')
  return res.json()
}

export async function fetchChecklist(subsystemId: string): Promise<ChecklistTask[]> {
  const res = await fetch(`${BASE_URL}/api/checklist/${subsystemId}`)
  if (!res.ok) throw new Error('Failed to fetch checklist')
  return res.json()
}

export type Summary = {
  planned_checks_today: number
  estimated_maintenance_hours: number
  subsystems_eligible: number
  status_percentage: number
  low_stock_alerts: number
  life_span_alerts: number
  total_active_subsystems: number
  pm_completion_rate_mtd: number
}

export async function fetchSummary(dateStr: string): Promise<Summary> {
  const res = await fetch(`${BASE_URL}/api/summary/${dateStr}`)
  if (!res.ok) throw new Error('Failed to fetch summary')
  return res.json()
}

export type Eligibility = {
  subsystem_id: string
  subsystem_full_name: string
  pm_frequency: string
  est_duration_hrs: number
}

export async function fetchEligibility(dateStr: string): Promise<Eligibility[]> {
  const res = await fetch(`${BASE_URL}/api/eligibility/${dateStr}`)
  if (!res.ok) throw new Error('Failed to fetch eligibility')
  return res.json()
}

export type Consumable = {
  item_id: string
  consumable_item_name: string
  associated_subsystems: string | null
  unit_of_measure: string | null
  current_qty: number | null
  alert_threshold: number | null
  status: string
  storage_location: string | null
}

export async function fetchConsumables(): Promise<Consumable[]> {
  const res = await fetch(`${BASE_URL}/api/consumables`)
  if (!res.ok) throw new Error('Failed to fetch consumables')
  return res.json()
}

export type Spare = {
  spare_id: string
  spare_item_name: string
  subsystem_id: string | null
  months_remaining: number | null
  status: string
  alert_level: string | null
  replacement_action: string | null
  storage_location: string | null
}

export async function fetchSpares(): Promise<Spare[]> {
  const res = await fetch(`${BASE_URL}/api/spares`)
  if (!res.ok) throw new Error('Failed to fetch spares')
  return res.json()
}

export async function updateTaskStatus(taskId: string, status: string): Promise<ChecklistTask> {
  const res = await fetch(`${BASE_URL}/api/checklist/${taskId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completion_status: status }),
  })
  if (!res.ok) throw new Error('Failed to update task status')
  return res.json()
}

export type RescheduleResult = {
  log_id: string
  original_date: string
  new_date: string
  status: string
}

export async function rescheduleTask(
  subsystemId: string,
  originalDate: string,
  newDate: string,
  reason: string
): Promise<RescheduleResult> {
  const res = await fetch(`${BASE_URL}/api/reschedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subsystem_id: subsystemId, original_date: originalDate, new_date: newDate, reason }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Reschedule failed')
  }
  return res.json()
}

export function getExportPdfUrl(dateStr: string): string {
  return `${BASE_URL}/api/export/${dateStr}`
}

export type UploadResult = {
  filename: string
  uploaded_at: string
  summary: Record<string, { inserted: number; updated: number }>
}

export type LastUpdate = {
  filename: string | null
  uploaded_at: string | null
}

export async function uploadExcel(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/api/admin/upload-excel`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Upload failed')
  }
  return res.json()
}

export async function fetchLastUpdate(): Promise<LastUpdate> {
  const res = await fetch(`${BASE_URL}/api/admin/last-update`)
  if (!res.ok) throw new Error('Failed to fetch last update')
  return res.json()
}