import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ALL_ROOMS = [
  "102", "103", "105", "106", "107",
  "201", "202", "203", "205", "206", "207", "208"
];

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function ReservationStatus() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("reservation_date", formatDate(selectedDate));

      if (error) {
        console.error("Error fetching reservations:", error);
      } else {
        setReservations(data || []);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  const calendarDates = [];
  const currentDate = new Date(startDate);

  while (currentDate < endDate) {
    calendarDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const bookedRooms = [...new Set(reservations.map(r => r.room_number))];
  const availableRooms = ALL_ROOMS.filter(room => !bookedRooms.includes(room));

  return (
    <div className="bg-red-200 min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">예약 현황</h1>

      <div className="border border-gray-400 inline-block p-4 mb-6">
        {calendarDates.map((date, index) => {
          const isSelected = formatDate(date) === formatDate(selectedDate);
          const isFirst = index === 0;
          const label =
            isFirst || date.getDate() === 1
              ? `${date.getFullYear()}년 ${date.getMonth() + 1}월`
              : "";

          return (
            <React.Fragment key={date.toISOString()}>
              {label && (
                <div className="font-semibold mt-2 mb-1">{label}</div>
              )}
              <button
                onClick={() => setSelectedDate(date)}
                className={`mx-1 ${
                  isSelected ? "font-bold underline" : ""
                }`}
              >
                {date.getDate()}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="bg-white rounded p-4 text-left max-w-md mx-auto">
        <p><strong>선택일:</strong> {formatDate(selectedDate)}</p>
        <p><strong>예약된 객실:</strong> {bookedRooms.length > 0 ? bookedRooms.join(", ") : "없음"}</p>
        <p><strong>빈 객실:</strong> {availableRooms.join(", ")}</p>
      </div>
    </div>
  );
}

export default ReservationStatus;
