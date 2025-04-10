// src/ReservationStatus.js
import { useState } from 'react';

const rooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];
const today = new Date();

// 해당 월의 전체 일 수를 구하는 함수
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// 날짜를 YYYY-MM-DD 형식으로 포맷하는 함수
const formatDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// 예시 예약 데이터 (예약 날짜를 키로, 예약된 객실 번호 배열을 값으로 저장)
const sampleReservations = {
  '2024-05-15': ['102', '103', '202', '203', '205', '208'],
};

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);

  // 오늘부터 한 달 뒤까지 날짜 생성
  const startDate = today;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const dates = [];
  let temp = new Date(startDate);
  while (temp < endDate) {
    dates.push(new Date(temp));
    temp.setDate(temp.getDate() + 1);
  }

  // 날짜들을 연-월별로 그룹화 (예: 2025-03, 2025-04 등)
  const months = {};
  for (const date of dates) {
    const key = `${date.getFullYear()}-${date.getMonth()}`; // 예: "2025-4"
    if (!months[key]) months[key] = [];
    months[key].push(date);
  }

  // 날짜 버튼 클릭 시 선택된 날짜 업데이트
  const handleDateClick = (date) => {
    const dateKey = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(dateKey);
  };

  const reservedRooms = selectedDate ? sampleReservations[selectedDate] || [] : [];
  const vacantRooms = rooms.filter(r => !reservedRooms.includes(r));

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* 앱 타이틀 */}
      <h1 className="text-xl font-bold text-center mb-4">동남모텔 예약 현황판</h1>

      {/* 달력 영역 (상단 카드) */}
      <div className="border rounded-xl p-4 bg-white mb-6">
        {Object.entries(months).map(([key, dateList]) => {
          const [year, month] = key.split('-').map(Number);
          // 해당 달의 시작 날짜의 요일 (0: 일요일, 6: 토요일)
          const startWeekday = new Date(year, month, dateList[0].getDate()).getDay();

          return (
            <div key={key} className="mb-6">
              <div className="text-center text-lg font-semibold mb-2">
                {year}년 {month + 1}월
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {/* 요일 헤더 */}
                {[...'일월화수목금토'].map((d, i) => (
                  <div key={i} className="font-medium text-sm">{d}</div>
                ))}
                {/* 시작 요일에 맞춰 빈 공간 채우기 */}
                {Array.from({ length: startWeekday }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* 날짜 버튼들 */}
                {dateList.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    className={`py-2 px-2 rounded-full text-sm transition-colors duration-200
                      ${selectedDate === formatDate(date.getFullYear(), date.getMonth(), date.getDate())
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-200'}`}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 예약 결과 영역 (하단 카드) */}
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
