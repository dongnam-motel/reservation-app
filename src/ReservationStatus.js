import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

const ReservationStatus = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    async function fetchReservations() {
      const { data, error } = await supabase.from('reservations').select('*');
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setReservations(data);
      }
    }
    fetchReservations();
  }, []);

  return (
    <div>
      <h2>예약 현황</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>예약 날짜</th>
            <th>객실 번호</th>
            <th>예약자</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.room_number}</td>
              <td>{reservation.guest_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationStatus;
