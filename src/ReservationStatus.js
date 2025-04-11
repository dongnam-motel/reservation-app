import { useState } from 'react';
import { supabase } from './supabaseClient';

// 전체 객실 목록
const rooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];
const today = new Date();

// 날짜 포맷: YYYY-MM-DD
const formatDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);

  // 오늘부터 한 달 후까지의 날짜 배열 생성
  const startDate = today;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const dates = [];
  let temp = new Date(startDate);
  while (temp < endDate) {
    dates.push(new Date(temp));
    temp.setDate(temp.getDate() + 1);
  }

  // 달력 UI 구성을 위한 월별 그룹화
  const months = {};
  for (const date of dates) {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!months[key]) months[key] = [];
    months[key].push(date);
  }

  // 날짜 클릭 시 Supabase에서 해당 날짜의 예약 데이터 조회
  const handleDateClick = async (date) => {
    const dateKey = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(dateKey);

    const { data, error } = await supabase
      .from('reservations')
      .select('room_number')
      .eq('reservation_date', dateKey);

    if (error) {
      console.error('예약 데이터 불러오기 실패:', error.message);
      setReservedRooms([]);
    } else {
      const roomsReserved = data.map((item) => item.room_number);
      setReservedRooms(roomsReserved);
    }
  };

  const vacantRooms = rooms.filter((r) => !reservedRooms.includes(r));

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center mb-4">동남모텔 예약 현황판</h1>

      {/* 달력 UI */}
      <div className="border rounded-xl p-4 bg-white mb-6">
        {Object.entries(months).map(([key, dateList]) => {
          const [year, month] = key.split('-').map(Number);
          const startWeekday = new Date(year, month, dateList[0].getDate()).getDay();

          return (
            <div key={key} className="mb-6">
              <div className="text-center text-lg font-semibold mb-2">
                {year}년 {month + 1}월
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {[...'일월화수목금토'].map((d, i) => (
                  <div key={i} className="font-medium text-sm">{d}</div>
                ))}
                {Array.from({ length: startWeekday }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {dateList.map((date) => {
                  const dateKey = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`py-2 px-2 rounded-full text-sm transition-colors duration-200 ${
                        selectedDate === dateKey
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 예약 결과 영역 */}
      <div className="border rounded-xl p-4 bg-gray-50">
        {selectedDate ? (
          <div>
            <h2 className="text-md font-semibold mb-2">예약 정보 ({selectedDate})</h2>
            <div className="mb-3 text-sm">
              예약된 객실: {reservedRooms.length ? reservedRooms.join(', ') : '없음'}
            </div>
            <div className="text-sm">
              빈 객실: {vacantRooms.length ? vacantRooms.join(', ') : '없음'}
            </div>
          </div>
        ) : (
          <div className="text-sm text-center text-gray-500">
            날짜를 선택하면 예약 정보가 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
