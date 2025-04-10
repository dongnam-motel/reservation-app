import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [reservations, setReservations] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sheets.googleapis.com/v4/spreadsheets/your-sheet-id/values/Sheet1?key=your-api-key"
        );
        setReservations(response.data.values); // 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Reservation App</h1>
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index}>{reservation[0]}</li>  {/* 예시로 예약된 날짜 또는 객실 번호 표시 */}
        ))}
      </ul>
    </div>
  );
}

export default App;
