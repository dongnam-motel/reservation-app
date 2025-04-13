import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ReservationStatus = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);
  const [allRooms] = useState([
    '102', '103', '105', '106', '107',
    '201', '202', '203', '205', '206', '207', '208',
  ]);

  const today = new Date();
  const thisMonth = today.getMonth();
  const nextMonth = (thisMonth + 1) % 12;
  const currentYear = today.getFullYear();

  const getMonthDays = (year, month) => {
    const days = [];
    const startDate = new Date(year, month, today.getDate());
    const endDate = new Date(year, month + 1, 0);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const getNextMonthDays = () => {
    const start = new Date(currentYear, nextMonth, 1);
    const end = new Date(currentYear, nextMonth, today.getDate() - 1);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const fetchReservations = async (dateString) => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', dateString);

    if (!error) {
      const reserved = data.map((entry) => entry.room.toString());
      setReservedRooms(reserved);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
    fetchReservations(dateStr);
  };

  const renderCalendar = (days) => {
    return (
      <div className="grid grid-cols-7 gap-1 text-center text-black text-lg">
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => handleDateClick(day)}
            className={`cursor-pointer ${
              formatDate(day) === selectedDate ? 'underline' : ''
            }`}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    );
  };

  const emptyRooms = allRooms.filter((room) => !reservedRooms.includes(room));

  return (
    <div className="min-h-screen bg-red-200 flex flex-col items-center p-4 space-y-6">
      <h1 className="text-4xl font-bold">예약 현황</h1>

      <div className="text-center font-semibold text-lg grid grid-cols-7 w-full max-w-md">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      <div className="bg-red-100 p-4 rounded-md shadow w-full max-w-md space-y-4">
        <h2 className="text-center font-bold text-xl">{currentYear}년 4월</h2>
        {renderCalendar(getMonthDays(currentYear, thisMonth))}

        <h2 className="text-center font-bold text-xl">{currentYear}년 5월</h2>
        {renderCalendar(getNextMonthDays())}
      </div>

      <div className="bg-white p-4 rounded-md shadow-md w-full max-w-md">
        {selectedDate ? (
          <>
            <p className="font-bold">선택일: <span className="font-normal">{selectedDate}</span></p>
            <p className="font-bold">예약된 객실: <span className="font-normal">{reservedRooms.join(', ') || '없음'}</span></p>
            <p className="font-bold">빈 객실: <span className="font-normal">{emptyRooms.join(', ') || '없음'}</span></p>
          </>
        ) : (
          <p className="text-center text-gray-600">날짜를 선택하면 예약 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

export default ReservationStatus;
