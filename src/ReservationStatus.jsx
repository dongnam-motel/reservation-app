import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import dayjs from 'dayjs';

// 107과 201을 방 목록에서 아예 제외 -> 다시 추가
const allRooms = [
  '102', '103', '105, '106', '107',
  '201', '202', '203', '205', '206', '207', '208'
];

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);

  useEffect(() => {
    if (!selectedDate) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from('reservations')
        .select('room_number')
        .eq('reservation_date', dayjs(selectedDate).format('YYYY-MM-DD'));
      setReservedRooms(data?.map(r => r.room_number) || []);
    };
    fetchData();
  }, [selectedDate]);

  const today = dayjs();
  const nextMonthToday = today.add(1, 'month');
  const lastDayCurrentMonth = today.endOf('month').date();
  const startWeekday = today.day();

  const endDate = nextMonthToday.subtract(1, 'day');
  const firstDayNextMonth = nextMonthToday.startOf('month');
  const nextStartWeekday = firstDayNextMonth.day();
  const nextEndDay = endDate.date();

  const renderDays = (start, end, offset, monthTitle, month) => {
    const days = [];
    for (let i = 0; i < offset; i++) {
      days.push(<div key={`${monthTitle}-blank-${i}`}></div>);
    }
    for (let i = start; i <= end; i++) {
      const dateObj = month === 'current' ? today.date(i) : firstDayNextMonth.date(i);
      const formatted = dayjs(dateObj).format('YYYY-MM-DD');
      days.push(
        <div
          key={`${monthTitle}-${i}`}
          onClick={() => setSelectedDate(formatted)} 
          className={`cursor-pointer ${formatted === dayjs(selectedDate).format('YYYY-MM-DD') ? 'font-bold underline' : ''}`}
        >
          {i}
        </div>
      );
    }
    return (
      <div className="mb-4">
        <div className="text-center font-bold mb-2">{monthTitle}</div>
        <div className="grid grid-cols-7 gap-y-2 text-center">{days}</div>
      </div>
    );
  };

  // 빈 객실 목록에서 이미 제외된 방이므로, reservedRooms만 필터링하면 됩니다.
  const emptyRooms = allRooms.filter(r => !reservedRooms.includes(r));

  return (
    <div className="min-h-screen bg-pink-200 p-4">
      <h1 className="text-center text-3xl font-bold mb-2">예약 현황</h1>
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="bg-pink-100 rounded-md p-4">
        {renderDays(today.date(), lastDayCurrentMonth, startWeekday, `${today.year()}년 ${today.month() + 1}월`, 'current')}
        {renderDays(1, nextEndDay, nextStartWeekday, `${nextMonthToday.year()}년 ${nextMonthToday.month() + 1}월`, 'next')}
      </div>
      <div className="bg-white rounded-md shadow-md mt-6 p-4 text-center">
        {selectedDate ? (
          <>
            <p className="mb-2">
              <span className="font-semibold">선택일:</span> {dayjs(selectedDate).format('YYYY-MM-DD')}
            </p>
            <p className="mb-2">
              <span className="font-semibold">예약된 객실:</span>{' '}
              {reservedRooms.length > 0 ? reservedRooms.join(', ') : '없음'}
            </p>
            <p>
              <span className="font-semibold">빈 객실:</span>{' '}
              {emptyRooms.length > 0 ? emptyRooms.join(', ') : '없음'}
            </p>
          </>
        ) : (
          <p>날짜를 선택하면 예약 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
