import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const allRooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getDatesWithOffset(startDate, endDate) {
  const dates = [];
  const startDay = startDate.getDay();
  for (let i = 0; i < startDay; i++) {
    dates.push(null); // offset for start day
  }
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const aprilStart = new Date(currentYear, currentMonth, today.getDate());
  const aprilEnd = new Date(currentYear, currentMonth, 30);

  const nextMonth = (currentMonth + 1) % 12;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const mayStart = new Date(nextYear, nextMonth, 1);
  const mayEnd = new Date(nextYear, nextMonth, today.getDate() - 1);

  const aprilDates = getDatesWithOffset(aprilStart, aprilEnd);
  const mayDates = getDatesWithOffset(mayStart, mayEnd);

  useEffect(() => {
    if (!selectedDate) return;
    const fetchData = async () => {
      const dateString = formatDate(selectedDate);
      const { data, error } = await supabase
        .from('reservations')
        .select('room_number')
        .eq('reservation_date', dateString);

      if (!error) {
        const reserved = data.map(r => r.room_number);
        setReservedRooms(reserved);
      }
    };
    fetchData();
  }, [selectedDate]);

  const availableRooms = allRooms.filter(room => !reservedRooms.includes(room));
  const isSameDate = (a, b) => a && b && formatDate(a) === formatDate(b);

  const renderDates = (dates) => (
    <div className="grid grid-cols-7 text-center gap-y-1">
      {dates.map((date, idx) => (
        <div
          key={idx}
          className={`py-1 cursor-pointer ${isSameDate(date, selectedDate) ? 'font-bold underline' : ''}`}
          onClick={() => date && setSelectedDate(date)}
        >
          {date ? date.getDate() : ''}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-pink-200 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-2">예약 현황</h1>
      {/* 요일 */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="bg-pink-100 p-4 rounded-xl shadow-md max-w-3xl mx-auto">
        <div className="text-center font-bold mb-1">2025년 4월</div>
        {renderDates(aprilDates)}
        <div className="text-center font-bold mt-4 mb-1">2025년 5월</div>
        {renderDates(mayDates)}
      </div>
      <div className="mt-6 p-4 bg-white rounded-xl shadow-md max-w-2xl mx-auto text-center">
        {selectedDate ? (
          <>
            <p className="font-bold">선택일: <span className="font-normal">{formatDate(selectedDate)}</span></p>
            <br />
            <p className="font-bold">예약된 객실: <span className="font-normal">{reservedRooms.length > 0 ? reservedRooms.join(', ') : '없음'}</span></p>
            <p className="font-bold">빈 객실: <span className="font-normal">{availableRooms.length > 0 ? availableRooms.join(', ') : '없음'}</span></p>
          </>
        ) : (
          <p className="text-gray-600">날짜를 선택하면 예약 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
