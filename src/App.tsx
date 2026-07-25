import { useState } from 'react'
import Calendar from './components/Calendar'
import ChecklistPanel from './components/ChecklistPanel'
import StatCards from './components/StatCards'
import './App.css'

function App() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  return (
    <div className="dashboard">
      <h1>Radar Preventive Maintenance Dashboard</h1>
      <StatCards selectedDay={selectedDay} />
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <ChecklistPanel selectedDay={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  )
}

export default App