// transactionExample.js
const pool = require('./db');

async function doTransaction() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // 開始交易

    const studentId = 'S10721002'; // ⬅️ 學號定義為字串變數

    // 檢查學號是否存在
    const [rows] = await conn.query('SELECT * FROM STUDENT WHERE Student_ID = ?', [studentId]);
    if (rows.length === 0) {
      throw new Error(`學號 ${studentId} 不存在，無法進行交易`);
    }

    // 更新 STUDENT 表格中的系所
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, ['FN001', studentId]);

    // 更新 ENROLLMENT 表格中的狀態
    const updateCourses = 'UPDATE ENROLLMENT SET Status = ? WHERE Student_ID = ?';
    await conn.query(updateCourses, ['修課中', studentId]);

    // 提交交易
    await conn.commit();
    console.log('交易成功，已提交');

    // 查詢修改後的系所
    const [updatedRows] = await conn.query(
        `SELECT S.Student_ID, S.Name, D.Department_ID, D.Name AS Department_Name
         FROM STUDENT S
         JOIN DEPARTMENT D ON S.Department_ID = D.Department_ID
         WHERE S.Student_ID = ?`, [studentId]
    );      

    if (updatedRows.length > 0) {
        const s = updatedRows[0];
        console.log(`學生 ${s.Student_ID}（${s.Name}）目前系所為：${s.Department_ID} - ${s.Department_Name}`);
    }
      

  } catch (err) {
    // 若有任何錯誤，回滾所有操作
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾：', err.message);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();
