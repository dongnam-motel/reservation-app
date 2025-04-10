// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 만약 Tailwind CSS 설정 파일이 있다면 포함

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
