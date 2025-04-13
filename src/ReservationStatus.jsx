// src/ReservationStatus.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import dayjs from 'dayjs';

const allRooms = [
  '102', '103', '105', '106', '107',
  '201', '202', '203', '205', '206', '207', '208',
];

const ReservationStatus = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate) return;

      const { data, error } = await supabase
        .from('reservations')
        .select('room_number')
        .eq('reservation_date', selectedDate.toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching reservations:', error);
        return;
      }

      const reserved = data.map((r) => r.room_number);
      const available = allRooms.filter((room) => !reserved.includes(room));

      setReservedRooms(reserved);
      setAvailableRooms(available);
    };

    fetchData();
  }, [selectedDate]);

  const today = dayjs();
  const nextMonth = today.add(1, 'month');
  const endDate = nextMonth.subtract(1, 'day');

  const generateCalendarDates = (startDate, endDay) => {
    const dates = [];
    const startOfWeek = startDate.day(); // 0 (일) ~ 6 (토)

    // 앞 공백 추가
    for (let i = 0; i < startOfWeek; i++) {
      dates.push(null);
    }

    for (let d = 0; d <= endDay.date() - startDate.date(); d++) {
      dates.push(startDate.add(d, 'day').toDate());
    }

    return dates;
  };

  const aprilDates = generateCalendarDates(today, today.endOf('month'));
  const mayDates = generateCalendarDates(nextMonth.startOf('month'), endDate);

  const renderDates = (dates) => (
    <div className="grid grid-cols-7 gap-y-2 text-center mt-2">
      {dates.map((date, index) =>
        date ? (
          <div
            key={index}
            className={`cursor-pointer ${selectedDate?.toDateString() === date.toDateString() ? 'font-bold underline' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {date.getDate()}
          </div>
        ) : (
          <div key={index}></div>
        )
      )}
    </div>
  );

  return (
    <div className="bg-red-200 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-2">예약 현황</h1>
      <div className="grid grid-cols-7 gap-y-2 text-center font-semibold">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="bg-pink-100 p-4 rounded-md shadow mt-2 w-full max-w-md">
        <div className="text-center font-bold mb-2">2025년 4월</div>
        {renderDates(aprilDates)}
        <div className="text-center font-bold mt-4 mb-2">2025년 5월</div>
        {renderDates(mayDates)}
      </div>
      <div className="bg-white p-4 mt-4 rounded-md shadow w-full max-w-md text-sm">
        {selectedDate ? (
          <>
            <p><strong>선택일:</strong> {dayjs(selectedDate).format('YYYY-MM-DD')}</p>
            <br />
            <p><strong>예약된 객실:</strong> {reservedRooms.length > 0 ? reservedRooms.join(', ') : '없음'}</p>
            <p><strong>빈 객실:</strong> {availableRooms.length > 0 ? availableRooms.join(', ') : '없음'}</p>
          </>
        ) : (
          <p>날짜를 선택하면 예약 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

export default ReservationStatus;
