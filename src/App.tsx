import { useState } from 'react'
import Calendar from './components/Calendar'
import ChecklistPanel from './components/ChecklistPanel'
import './App.css'

function App() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  return (
    <div className="dashboard">
      <h1>Radar Preventive Maintenance Dashboard</h1>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <ChecklistPanel selectedDay={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  )
}

export default App