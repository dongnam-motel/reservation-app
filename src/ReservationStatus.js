import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 연결
const supabaseUrl = 'https://qjrujlohkglfmghctiue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcnVqbG9oa2dsZm1naGN0aXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDg0ODQsImV4cCI6MjA1OTg4NDQ4NH0.lZHhfPjZ_CI6ERPjXvcf8657GcBraULMmAAIMfFzXms';
const supabase = createClient(supabaseUrl, supabaseKey);

// 모든 객실 목록
const allRooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];

// 날짜 포맷 함수
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  // 날짜 리스트 생성
  const dates = [];
  let temp = new Date(today);
  while (temp <= nextMonth) {
    dates.push(new Date(temp));
    temp.setDate(temp.getDate() + 1);
  }

  const months = {};
  for (const date of dates) {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!months[key]) months[key] = [];
    months[key].push(date);
  }

  // Supabase에서 데이터 불러오기
 useEffect(() => {
  async function fetchReservations() {
    const { data, error } = await supabase.from('reservations').select('*');
    if (error) {
      console.error('❌ Supabase 오류:', error);
      return;
    }
    console.log('✅ Supabase에서 받은 데이터:', data); // 이거 찍히는지 꼭 보기!


      const grouped = {};
      data.forEach((item) => {
        const date = item.reservation_date;
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item.room_number);
      });

      console.log('✅ 예약 데이터:', grouped);
      setReservations(grouped);
      setLoading(false);
    }

    fetchReservations();
  }, []);

  const reservedRooms = selectedDate ? reservations[selectedDate] || [] : [];
  const vacantRooms = allRooms.filter((room) => !reservedRooms.includes(room));

  return (
    <div className="p-4 max-w-md mx-auto bg-pink-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">동남모텔 예약 현황판</h1>

      {/* 달력 */}
      <div className="bg-white rounded-xl p-4 mb-6">
        {Object.entries(months).map(([key, dateList]) => {
          const [year, month] = key.split('-').map(Number);
          const startWeekday = new Date(year, month, 1).getDay();

          return (
            <div key={key} className="mb-6">
              <div className="text-center font-semibold text-lg mb-2">{year}년 {month + 1}월</div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                {[...'일월화수목금토'].map((d, i) => (
                  <div key={i} className="font-medium">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {Array.from({ length: startWeekday }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {dateList.map((date) => {
                  const dateStr = formatDate(date);
                  return (
                    <button
                      key={dateStr}
                      className={`py-1 rounded-full ${selectedDate === dateStr ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => setSelectedDate(dateStr)}
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

      {/* 예약 결과 */}
      <div className="bg-gray-50 rounded-xl p-4">
        {loading ? (
          <div className="text-center text-gray-500">불러오는 중...</div>
        ) : selectedDate ? (
          <>
            <h2 className="text-md font-semibold mb-2">예약 정보 ({selectedDate})</h2>
            <div className="mb-1 text-sm">예약된 객실: {reservedRooms.length ? reservedRooms.join(', ') : '없음'}</div>
            <div className="text-sm">빈 객실: {vacantRooms.length ? vacantRooms.join(', ') : '없음'}</div>
          </>
        ) : (
          <div className="text-center text-gray-500 text-sm">날짜를 선택하면 예약 정보를 확인할 수 있습니다.</div>
        )}
      </div>
    </div>
  );
}
