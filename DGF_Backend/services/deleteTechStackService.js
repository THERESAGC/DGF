//services/deleteTechStackService.js
const db = require('../config/db');
 
const deleteTechStackAndSkills = async (stackId) => {
  const connection = await db.promise().getConnection();
  
  try {
    await connection.beginTransaction();
 
    // Delete associated primary skills first
    const deleteSkillsQuery = 'DELETE FROM primaryskill WHERE stack_id = ?';
    await connection.execute(deleteSkillsQuery, [stackId]);
 
    // Delete the tech stack
    const deleteStackQuery = 'DELETE FROM techstack WHERE stack_id = ?';
    const [result] = await connection.execute(deleteStackQuery, [stackId]);
 
    if (result.affectedRows === 0) {
      throw new Error('Tech stack not found');
    }
 
    await connection.commit();
    return true;
 
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
 
module.exports = {
  deleteTechStackAndSkills
};
 