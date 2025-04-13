import React from 'react'
import ReservationStatus from './ReservationStatus'
import './App.css'

function App() {
  return (
    <div className="bg-red-200 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-4">예약 현황</h1>
      <ReservationStatus />
    </div>
  )
}

export default App
