import { useState } from 'react'
import Calendar from './components/Calendar'
import ChecklistPanel from './components/ChecklistPanel'
import StatCards from './components/StatCards'
import InventoryPanel from './components/InventoryPanel'
import './App.css'

function App() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(4) // May (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  function goToPreviousMonth() {
    setSelectedDay(null)
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function goToNextMonth() {
    setSelectedDay(null)
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <div className="dashboard">
      <h1>Radar Preventive Maintenance Dashboard</h1>
      <StatCards year={year} month={month} selectedDay={selectedDay} />
      <div className="main-layout">
        <Calendar
          year={year}
          month={month}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
        <InventoryPanel />
      </div>
      <ChecklistPanel
        year={year}
        month={month}
        selectedDay={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  )
}

export default App