import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '817829752684-sjnccc49ld8r72a8rtui9gdqtuh23l3l.apps.googleusercontent.com.apps.googleusercontent.com'; // Google Cloud Console에서 발급받은 값을 입력하세요
const API_KEY = 'YOUR_API_KEY'; // 만약 API 키가 필요하다면 입력, 또는 생략 가능
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

function GoogleAuth() {
  useEffect(() => {
    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        console.log('Google API 클라이언트 초기화 완료');
      })
      .catch((error) => {
        console.error('gapi 초기화 에러:', error);
      });
    }
    gapi.load('client:auth2', initClient);
  }, []);

  const handleAuthClick = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signIn()
        .then((user) => {
          console.log('로그인 성공:', user);
          // 여기서 액세스 토큰 등을 확인하고, 이후 Google Sheets API 호출에 활용할 수 있습니다.
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
        });
    }
  };

  const handleSignOutClick = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signOut()
        .then(() => {
          console.log('로그아웃 성공');
        })
        .catch((error) => {
          console.error('로그아웃 실패:', error);
        });
    }
  };

  return (
    <div className="p-4">
      <button onClick={handleAuthClick} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Google 로그인
      </button>
      <button onClick={handleSignOutClick} className="bg-red-500 text-white px-4 py-2 rounded">
        로그아웃
      </button>
    </div>
  );
}

export default GoogleAuth;
