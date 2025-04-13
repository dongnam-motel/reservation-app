// src/ReservationStatus.jsx
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import dayjs from 'dayjs';

const allRooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];

function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    if (!selectedDate) return;
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('room_number')
        .eq('reservation_date', selectedDate);

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const reserved = data.map(r => r.room_number);
      const available = allRooms.filter(r => !reserved.includes(r));

      setReservedRooms(reserved);
      setAvailableRooms(available);
    };

    fetchData();
  }, [selectedDate]);

  const getCalendarDates = () => {
    const today = dayjs();
    const startDate = today.startOf('day');
    const endDate = today.add(1, 'month').date(12); // 다음달 12일까지 출력
    const dates = [];

    let current = startDate;
    while (current.isBefore(endDate) || current.isSame(endDate)) {
      dates.push(current);
      current = current.add(1, 'day');
    }
    return dates;
  };

  const renderCalendar = () => {
    const dates = getCalendarDates();
    const grouped = {};

    dates.forEach(date => {
      const month = date.format('YYYY-MM');
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(date);
    });

    return Object.entries(grouped).map(([month, days]) => (
      <div key={month} className="text-center mb-4">
        <h2 className="text-lg font-bold mb-2">{dayjs(month).format('YYYY년 M월')}</h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map(date => (
            <button
              key={date.format('YYYY-MM-DD')}
              className={`text-sm ${selectedDate === date.format('YYYY-MM-DD') ? 'font-bold underline' : ''}`}
              onClick={() => setSelectedDate(date.format('YYYY-MM-DD'))}
            >
              {date.date()}
            </button>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-red-200 p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">예약 현황</h1>
      <div className="font-bold grid grid-cols-7 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="bg-pink-100 p-4 rounded-xl shadow-md">
        {renderCalendar()}
      </div>
      <div className="mt-6 bg-white rounded-xl shadow-md p-4 text-left inline-block">
        <p className="font-bold">선택일: <span className="font-normal">{selectedDate || '날짜를 선택하세요'}</span></p>
        <p className="font-bold">예약된 객실: <span className="font-normal">{reservedRooms.length ? reservedRooms.join(', ') : '없음'}</span></p>
        <p className="font-bold">빈 객실: <span className="font-normal">{availableRooms.length ? availableRooms.join(', ') : '없음'}</span></p>
      </div>
    </div>
  );
}

export default ReservationStatus;
