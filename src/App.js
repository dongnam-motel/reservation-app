import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [reservations, setReservations] = useState([]);
  const [vacantRooms, setVacantRooms] = useState([]);
  
  const rooms = ['102', '103', '105', '106', '107', '201', '202', '203', '205', '206', '207', '208'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sheets.googleapis.com/v4/spreadsheets/1rq4DrKJDRHVaarAtiEXnYpjxcCAo_Toj5dfAN1SqBH8/values/Sheet1?key=AIzaSyBdarOU_dDq_lih-6VW2Ak5wokEYBly5aY"
        );
        
        setReservations(response.data.values); 
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const getReservedRooms = (date) => {
    const reserved = reservations.filter((reservation) => reservation[0] === date);
    return reserved.map((r) => r[1]);
  };

  const reservedRooms = getReservedRooms('2024-05-15');
  const vacantRooms = rooms.filter(room => !reservedRooms.includes(room));

  return (
    <div>
      <h1>Reservation App</h1>
      <h2>예약된 객실</h2>
      <ul>
        {reservedRooms.length > 0 ? reservedRooms.map((room, index) => (
          <li key={index}>{room}</li>
        )) : <li>없음</li>}
      </ul>

      <h2>비어 있는 객실</h2>
      <ul>
        {vacantRooms.length > 0 ? vacantRooms.map((room, index) => (
          <li key={index}>{room}</li>
        )) : <li>없음</li>}
      </ul>
    </div>
  );
}

export default App;
