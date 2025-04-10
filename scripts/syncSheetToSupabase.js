// scripts/syncSheetToSupabase.js

const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

// 환경 변수에서 Supabase 및 Google 설정 읽어오기
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const range = process.env.GOOGLE_SHEET_RANGE; // 예: '예약 추출 시트!A2:C'
const googleApiKey = process.env.GOOGLE_API_KEY;

// Google Sheets API를 사용해 데이터 가져오기
async function fetchGoogleSheetData() {
  const sheets = google.sheets({ version: 'v4', auth: googleApiKey });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return res.data.values;
}

// 가져온 데이터를 Supabase의 reservations 테이블에 동기화
async function syncData() {
  try {
    const data = await fetchGoogleSheetData();
    console.log("Fetched data from Google Sheets:", data);

    // (옵션) 기존 예약 데이터 초기화 – 필요에 따라 수정하세요.
    // 모든 데이터 삭제 (테스트 환경에서 사용하고, 운영에서는 Upsert 정책 고려)
    await supabase.from('reservations').delete().neq('id', 0);

    // 각 행을 Supabase에 삽입합니다.
    for (const row of data) {
      // row 형식: [예약 날짜, 객실 번호, 예약자 이름]
      const [reservation_date, room_number, guest_name] = row;
      const { error } = await supabase.from('reservations').insert([
        { reservation_date, room_number, guest_name },
      ]);
      if (error) {
        console.error('Error inserting data:', error.message);
      }
    }
    console.log("Data synced to Supabase successfully!");
  } catch (error) {
    console.error("Error during sync:", error);
  }
}

syncData();
