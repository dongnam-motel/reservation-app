import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const allRooms = [
  "102", "103", "105", "106", "107",
  "201", "202", "203", "205", "206", "207", "208",
];

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getDaysInMonth(year, month, start = 1, end = null) {
  const days = [];
  const date = new Date(year, month, start);
  const last = end ?? new Date(year, month + 1, 0).getDate();

  const offset = date.getDay();
  for (let i = 0; i < offset; i++) days.push(null);

  for (let day = start; day <= last; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

export default function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  const nextMonth = (currentMonth + 1) % 12;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const nextMonthEndDate = today.getDate() - 1;

  const currentMonthDays = getDaysInMonth(currentYear, currentMonth, today.getDate());
  const nextMonthDays = getDaysInMonth(nextYear, nextMonth, 1, nextMonthEndDate);

  const handleDateClick = (date) => {
    if (date) setSelectedDate(date);
  };

  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      const dateString = formatDate(selectedDate);
      const { data, error } = await supabase
        .from("reservations")
        .select("room_number")
        .eq("reservation_date", dateString);

      if (error) console.error(error);
      else setReservations(data.map((r) => r.room_number));
    };

    fetchData();
  }, [selectedDate]);

  const availableRooms = allRooms.filter((room) => !reservations.includes(room));

  const renderDays = (days) =>
    days.map((day, idx) => (
      <span
        key={idx}
        className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
          day && formatDate(day) === formatDate(selectedDate) ? "font-bold underline" : ""
        }`}
        onClick={() => handleDateClick(day)}
      >
        {day ? day.getDate() : ""}
      </span>
    ));

  return (
    <div className="min-h-screen bg-red-200 flex flex-col items-center p-6 text-black">
      <h1 className="text-3xl font-bold mb-4">예약 현황</h1>
      <div className="bg-pink-100 p-6 rounded-md shadow-md w-full max-w-md">
        <div className="grid grid-cols-7 mb-2 text-center font-semibold">
          <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center">
          <div className="col-span-7 text-center font-bold mb-1">{currentYear}년 {currentMonth + 1}월</div>
          {renderDays(currentMonthDays)}
          <div className="col-span-7 text-center font-bold mt-4 mb-1">{nextYear}년 {nextMonth + 1}월</div>
          {renderDays(nextMonthDays)}
        </div>
      </div>

      <div className="bg-white p-4 mt-6 rounded-md shadow-md w-full max-w-md">
        {selectedDate ? (
          <>
            <p><strong>선택일:</strong> {formatDate(selectedDate)}</p>
            <br />
            <p><strong>예약된 객실:</strong> {reservations.length > 0 ? reservations.join(", ") : "없음"}</p>
            <br />
            <p><strong>빈 객실:</strong> {availableRooms.length > 0 ? availableRooms.join(", ") : "없음"}</p>
          </>
        ) : (
          <p className="text-gray-500">날짜를 선택하면 예약 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
