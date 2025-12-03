import  { useState } from 'react';
import axios from 'axios';
import './App.css'; 

type Log = {
  exercise_id: number;
  real_name: string;
  ex_title: string;
  ex_distance: number;
  ex_steps: number;
  ex_kcal: number;
  created_at: string;
};

const App = () => {
  // 1. 상태 관리: 오늘 날짜를 기본값으로 설정
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. 데이터 조회 함수
  const fetchLogs = async () => {
    try {
      console.log("클릭");
      setLoading(true);
      // 서버 API 호출 (URL은 실제 서버 주소에 맞게 수정)
      // const response = await axios.get(`http://obesity-app.r-e.kr/api/admin/logs`, {
      const response = await axios.get('api/admin/logs', {
        params: {
          startDate,
          endDate
        }
      });
      
      if (response.data.success) {
        setLogs(response.data.data);
      }
    } catch (error) {
      console.error('로그 불러오기 실패:', error);
      alert('데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 3. 렌더링
  return (
    <div className="container">
      <h1>🏋️‍♂️ STEPBREW - 운동 로그 </h1>
      
      {/* 날짜 검색 영역 */}
      <div className="search-bar">
        <label>시작일: </label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        
        <label> ~ 종료일: </label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
        
        <button onClick={fetchLogs} disabled={loading}>
          {loading ? '로딩 중...' : '조회하기'}
        </button>
      </div>

      {/* 데이터 테이블 영역 */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>사용자명</th>
              <th>운동 제목</th>
              <th>거리(km)</th>
              <th>걸음 수</th>
              <th>칼로리</th>
              <th>일시</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log: Log) => (
                <tr key={log.exercise_id}>
                  <td>{log.exercise_id}</td>
                  <td>{log.real_name}</td>
                  <td>{log.ex_title}</td>
                  <td>{(log.ex_distance / 1000).toFixed(2)}</td>
                  <td>{log.ex_steps.toLocaleString()}</td>
                  <td>{log.ex_kcal}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{textAlign: 'center'}}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;