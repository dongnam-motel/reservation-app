import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // App.js에서 컴포넌트를 가져옵니다.

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // public/index.html의 root div에 렌더링
);
