import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function App() {
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1rq4DrKJDRHVaarAtiEXnYpjxcCAo_Toj5dfAN1SqBH8/values/Sheet1?key=AIzaSyBdarOU_dDq_lih-6VW2Ak5wokEYBly5aY
'); // 구글 시트 API 링크
        setReservations(response.data.values); // 데이터 가져오기
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Reservation App</h1>
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index}>{reservation[0]}</li> // 예약된 날짜 등 표시
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
