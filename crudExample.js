// crudExample.js
const pool = require('./db');

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();
    
  
    
    // 2. SELECT 查詢
    sql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
    const rows = await conn.query(sql, ['CS001']);
    console.log('查詢結果：', rows);
   
  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }
}

basicCrud();
