import { useState } from 'react'
import Calendar from './components/Calendar'
import ChecklistPanel from './components/ChecklistPanel'
import StatCards from './components/StatCards'
import InventoryPanel from './components/InventoryPanel'
import DataUpload from './components/DataUpload'
import SubsystemEligibility from './components/SubsystemEligibility'
import { rescheduleTask, getExportPdfUrl } from './api'
import './App.css'

function App() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string | null>(null)
  const [selectedSubsystemLabel, setSelectedSubsystemLabel] = useState<string | null>(null)

  const dateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null

  function handleDaySelect(day: number) {
    setSelectedDay(day)
    setSelectedSubsystemId(null)
    setSelectedSubsystemLabel(null)
  }

  function goToPreviousMonth() {
    setSelectedDay(null)
    setSelectedSubsystemId(null)
    if (month === 0) { setMonth(11); setYear(year - 1) } else { setMonth(month - 1) }
  }

  function goToNextMonth() {
    setSelectedDay(null)
    setSelectedSubsystemId(null)
    if (month === 11) { setMonth(0); setYear(year + 1) } else { setMonth(month + 1) }
  }

  function handleExportPDF() {
    if (!dateStr) {
      alert('Please select a date first.')
      return
    }
    window.open(getExportPdfUrl(dateStr), '_blank')
  }

  async function handleReschedule() {
    if (!selectedSubsystemId || !dateStr) {
      alert('Select a date and subsystem first.')
      return
    }
    const newDate = prompt('Enter new date (YYYY-MM-DD):')
    if (!newDate) return
    const reason = prompt('Reason for rescheduling:') || 'No reason provided'

    try {
      const result = await rescheduleTask(selectedSubsystemId, dateStr, newDate, reason)
      alert(`Rescheduled: ${result.log_id} — ${result.original_date} → ${result.new_date}`)
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reschedule failed')
    }
  }

  return (
    <div className="dashboard">
      <div className="header-bar">
        <div className="header-title">
          <div className="header-icon">📡</div>
          <h1>Radar Preventive Maintenance Dashboard</h1>
        </div>
        <div className="header-actions">
          <button className="header-button" onClick={handleExportPDF}>Export Plan (PDF)</button>
          <button className="header-button primary" onClick={handleReschedule}>Reschedule PM</button>
        </div>
      </div>

      <DataUpload />
      <StatCards year={year} month={month} selectedDay={selectedDay} />

      <div className="frequency-legend">
        <span className="legend-item"><span className="legend-swatch" style={{ backgroundColor: '#1D4ED8' }} />Weekly</span>
        <span className="legend-item"><span className="legend-swatch" style={{ backgroundColor: '#B91C1C' }} />Monthly</span>
        <span className="legend-item"><span className="legend-swatch" style={{ backgroundColor: '#15803D' }} />Quarterly</span>
        <span className="legend-item"><span className="legend-swatch" style={{ backgroundColor: '#92400E' }} />Annual</span>
      </div>

      <div className="main-layout">
        <Calendar
          year={year}
          month={month}
          selectedDay={selectedDay}
          setSelectedDay={handleDaySelect}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
        <div className="side-column">
          <SubsystemEligibility
            dateStr={dateStr}
            selectedSubsystemId={selectedSubsystemId}
            setSelectedSubsystemId={(id, label) => {
              setSelectedSubsystemId(id)
              setSelectedSubsystemLabel(label)
            }}
          />
          <InventoryPanel />
        </div>
      </div>

      <ChecklistPanel
        isOpen={selectedDay !== null}
        subsystemId={selectedSubsystemId}
        subsystemLabel={selectedSubsystemLabel}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  )
}

export default App