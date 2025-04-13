import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const allRooms = [
  '102', '103', '105', '106', '107',
  '201', '202', '203', '205', '206', '207', '208'
];

function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);
  const [emptyRooms, setEmptyRooms] = useState([]);

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() - 1);

  const generateDateList = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dateList = generateDateList(startDate, endDate);

  const groupByMonth = (dates) => {
    return dates.reduce((acc, date) => {
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(date);
      return acc;
    }, {});
  };

  const dateGroups = groupByMonth(dateList);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (!selectedDate) return;
    const dateString = formatDate(selectedDate);

    supabase
      .from('reservations')
      .select('room_number')
      .eq('reservation_date', dateString)
      .then(({ data, error }) => {
        if (error) {
          console.error('Supabase fetch error:', error);
        } else {
          const reserved = data.map(row => row.room_number);
          setReservedRooms(reserved);
          setEmptyRooms(allRooms.filter(room => !reserved.includes(room)));
        }
      });
  }, [selectedDate]);

  return (
    <div className="p-4 bg-red-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">예약 현황</h1>
      <div className="bg-pink-100 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-7 text-center font-bold mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        {Object.entries(dateGroups).map(([monthKey, dates]) => (
          <div key={monthKey} className="mb-4">
            <div className="text-center font-bold mb-2">
              {monthKey.replace('-', '년 ')}월
            </div>
            <div className="grid grid-cols-7 text-center gap-y-1">
              {dates.map((date) => (
                <div
                  key={date.toISOString()}
                  className="cursor-pointer"
                  onClick={() => handleDateClick(date)}
                >
                  {date.getDate()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md text-base">
        {selectedDate ? (
          <>
            <p className="font-bold">
              선택일: <span className="font-normal">{formatDate(selectedDate)}</span>
            </p>
            <p className="font-bold mt-2">
              예약된 객실:{' '}
              <span className="font-normal">
                {reservedRooms.length > 0 ? reservedRooms.join(', ') : '없음'}
              </span>
            </p>
            <p className="font-bold">
              빈 객실:{' '}
              <span className="font-normal">
                {emptyRooms.length > 0 ? emptyRooms.join(', ') : '없음'}
              </span>
            </p>
          </>
        ) : (
          <p className="text-center text-gray-600">
            날짜를 선택하면 예약 정보가 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReservationStatus;
