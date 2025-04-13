import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const allRooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getDatesInRange(start, end) {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function ReservationStatus() {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const aprilStart = new Date(today);
  const aprilEnd = new Date(today);
  aprilEnd.setMonth(aprilEnd.getMonth() + 1);
  aprilEnd.setDate(today.getDate() - 1);

  const mayStart = new Date(today);
  mayStart.setMonth(today.getMonth() + 1);
  mayStart.setDate(1);
  const mayEnd = new Date(today);
  mayEnd.setMonth(today.getMonth() + 1);
  mayEnd.setDate(today.getDate() - 1);

  const aprilDates = getDatesInRange(aprilStart, aprilEnd);
  const mayDates = getDatesInRange(mayStart, mayEnd);

  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchReservations = async () => {
      const { data } = await supabase
        .from('reservations')
        .select('room_number')
        .eq('reservation_date', formatDate(selectedDate));

      setReservedRooms(data ? data.map((r) => r.room_number) : []);
    };

    fetchReservations();
  }, [selectedDate]);

  const isSameDate = (a, b) => a && b && formatDate(a) === formatDate(b);
  const blankDays = (date) => Array.from({ length: date.getDay() }, (_, i) => <div key={`b${i}`} />);

  return (
    <div className="bg-pink-200 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-2">예약 현황</h1>

      {/* 요일 표시 */}
      <div className="grid grid-cols-7 text-center font-semibold mb-1">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="bg-pink-100 p-4 rounded-xl shadow-md max-w-3xl mx-auto">
        {/* 4월 */}
        <div className="text-center font-bold mb-1">2025년 4월</div>
        <div className="grid grid-cols-7 text-center mb-4">
          {blankDays(aprilDates[0])}
          {aprilDates.map((date, idx) => (
            <div
              key={`a${idx}`}
              onClick={() => setSelectedDate(date)}
              className={`cursor-pointer py-1 ${isSameDate(date, selectedDate) ? 'font-bold underline' : ''}`}
            >
              {date.getDate()}
            </div>
          ))}
        </div>

        {/* 5월 */}
        <div className="text-center font-bold mb-1">2025년 5월</div>
        <div className="grid grid-cols-7 text-center">
          {blankDays(mayDates[0])}
          {mayDates.map((date, idx) => (
            <div
              key={`m${idx}`}
              onClick={() => setSelectedDate(date)}
              className={`cursor-pointer py-1 ${isSameDate(date, selectedDate) ? 'font-bold underline' : ''}`}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* 결과 표시창 */}
      <div className="mt-6 p-4 bg-white rounded-xl shadow-md max-w-2xl mx-auto text-center">
        {selectedDate ? (
          <>
            <p className="font-bold">
              선택일: <span className="font-normal">{formatDate(selectedDate)}</span>
            </p>
            <br />
            <p className="font-bold">
              예약된 객실:{' '}
              <span className="font-normal">
                {reservedRooms.length > 0 ? reservedRooms.join(', ') : '없음'}
              </span>
            </p>
            <p className="font-bold">
              빈 객실:{' '}
              <span className="font-normal">
                {allRooms.filter((room) => !reservedRooms.includes(room)).join(', ')}
              </span>
            </p>
          </>
        ) : (
          <p>날짜를 선택하면 예약 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
