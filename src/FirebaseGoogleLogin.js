import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // 추가로 필요한 Firebase 설정 값을 입력하세요.
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function FirebaseGoogleLogin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unregisterAuthObserver();
  }, []);

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log('로그인 성공:', result.user);
      })
      .catch(error => {
        console.error('로그인 에러:', error);
      });
  };

  return (
    <div className="p-4">
      {user ? (
        <div>
          <h3>{user.displayName}님, 환영합니다!</h3>
          <button onClick={() => firebase.auth().signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
            로그아웃
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="bg-blue-500 text-white px-4 py-2 rounded">
          Google 로그인
        </button>
      )}
    </div>
  );
}

export default FirebaseGoogleLogin;
