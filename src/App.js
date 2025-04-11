import React from 'react';
import ReservationStatus from './ReservationStatus'; // 기존 예약 현황 컴포넌트
import GoogleAuth from './GoogleAuth'; // 방금 만든 GoogleAuth 컴포넌트

function App() {
  return (
    <div className="App">
      <GoogleAuth />
      <ReservationStatus />
    </div>
  );
}

export default App;
