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
}

export async function fetchSummary(dateStr: string): Promise<Summary> {
  const res = await fetch(`${BASE_URL}/api/summary/${dateStr}`)
  if (!res.ok) throw new Error('Failed to fetch summary')
  return res.json()
}