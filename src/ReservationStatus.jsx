import React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 연결
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const rooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('reservation_date, room_number');
      if (error) console.error(error);
      else setReservations(data);
      setLoading(false);
    };
    fetchReservations();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = today.getMonth();
  const nextMonth = (thisMonth + 1) % 12;
  const thisYear = today.getFullYear();
  const nextMonthYear = thisMonth === 11 ? thisYear + 1 : thisYear;

  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const buildMonthDates = (year, month, startDay, endDay) => {
    const firstWeekday = new Date(year, month, startDay).getDay();
    const dateList = [];
    for (let i = startDay; i <= endDay; i++) {
      dateList.push(new Date(year, month, i));
    }
    return { firstWeekday, dateList };
  };

  const thisMonthStart = today.getDate();
  const thisMonthEnd = getLastDayOfMonth(thisYear, thisMonth);
  const nextMonthStart = 1;
  const nextMonthEnd = today.getDate() - 1;

  const thisMonthDates = buildMonthDates(thisYear, thisMonth, thisMonthStart, thisMonthEnd);
  const nextMonthDates = buildMonthDates(nextMonthYear, nextMonth, nextMonthStart, nextMonthEnd);

  const handleDateClick = (date) => {
    setSelectedDate(formatDate(date));
  };

  const getReservedRooms = (dateStr) =>
    reservations.filter(r => r.reservation_date === dateStr).map(r => r.room_number);

  const reservedRooms = selectedDate ? getReservedRooms(selectedDate) : [];
  const vacantRooms = rooms.filter(r => !reservedRooms.includes(r));

  const renderMonthBlock = (title, { firstWeekday, dateList }) => (
    <div className="mb-8" key={title}>
      <div className="text-lg font-semibold text-center mb-2">{title}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium mb-2">
        {[...'일월화수목금토'].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {dateList.map(date => {
          const dateStr = formatDate(date);
          const isSelected = selectedDate === dateStr;
          return (
            <div
              key={dateStr}
              onClick={() => handleDateClick(date)}
              className={`cursor-pointer py-1 select-none ${isSelected ? 'font-bold' : ''}`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-red-200 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">예약 현황</h1>

      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
        {renderMonthBlock(`${thisYear}년 ${thisMonth + 1}월`, thisMonthDates)}
        {nextMonthEnd > 0 &&
          renderMonthBlock(`${nextMonthYear}년 ${nextMonth + 1}월`, nextMonthDates)}
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-4">
        {loading ? (
          <div className="text-center text-gray-500 text-sm">로딩 중...</div>
        ) : selectedDate ? (
          <>
            <h2 className="text-md font-semibold mb-2">예약 정보 ({selectedDate})</h2>
            <div className="text-sm mb-1">예약된 객실: {reservedRooms.length ? reservedRooms.join(', ') : '없음'}</div>
            <div className="text-sm">빈 객실: {vacantRooms.length ? vacantRooms.join(', ') : '없음'}</div>
          </>
        ) : (
          <div className="text-center text-gray-500 text-sm">날짜를 선택하면 예약 정보가 표시됩니다.</div>
        )}
      </div>
    </div>
  );
}
