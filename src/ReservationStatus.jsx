import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const allRooms = [102, 103, 105, 106, 107, 201, 202, 203, 205, 206, 207, 208]

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate()
}

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reservedRooms, setReservedRooms] = useState([])

  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('room_number')
        .eq('reservation_date', formatDate(selectedDate))

      if (!error) {
        const reserved = data.map((r) => r.room_number)
        setReservedRooms(reserved)
      } else {
        console.error(error)
      }
    }

    fetchReservations()
  }, [selectedDate])

  const availableRooms = allRooms.filter((room) => !reservedRooms.includes(room))

  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setMonth(today.getMonth() + 1)

  const calendarDates = []

  // 1️⃣ 이번달: 오늘 ~ 말일까지
  const lastDayThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  for (let d = new Date(today); d <= lastDayThisMonth; d.setDate(d.getDate() + 1)) {
    calendarDates.push(new Date(d))
  }

  // 2️⃣ 다음달: 1일 ~ 다음달 오늘 전날까지
  const cutoffNext = new Date(today)
  cutoffNext.setMonth(today.getMonth() + 1)
  cutoffNext.setDate(today.getDate() - 1)
  for (
    let d = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    d <= cutoffNext;
    d.setDate(d.getDate() + 1)
  ) {
    calendarDates.push(new Date(d))
  }

  return (
    <div className="bg-red-200 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">예약 현황</h1>

      {/* 월별 구분 */}
      {[0, 1].map((monthOffset) => {
        const refDate = new Date()
        refDate.setMonth(refDate.getMonth() + monthOffset)
        const label = `${refDate.getFullYear()}년 ${refDate.getMonth() + 1}월`
        const monthDates = calendarDates.filter(
          (d) => d.getMonth() === refDate.getMonth()
        )

        return (
          <div key={monthOffset} className="mb-6">
            <h2 className="font-bold text-lg mb-2">{label}</h2>
            <div className="flex flex-wrap gap-2">
              {monthDates.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(new Date(date))}
                  className="px-2"
                >
                  {isSameDay(date, selectedDate)
                    ? <strong>{date.getDate()}</strong>
                    : date.getDate()}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <div className="mt-4">
        <p><strong>선택일:</strong> {formatDate(selectedDate)}</p>
        <p>예약된 객실: {reservedRooms.length > 0 ? reservedRooms.join(', ') : '없음'}</p>
        <p>빈 객실: {availableRooms.join(', ')}</p>
      </div>
    </div>
  )
}
