// addPrimarySkillService.js

const db = require('../config/db');
 
const addPrimarySkill = async (skillName, stackId) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM techstack WHERE stack_id = ?';
    try {
      // Execute the check query and destructure the result array
      const [rows] = await db.execute(checkQuery, [stackId]); // Destructure rows from the result
      console.log('Check result:', rows);

      const count = rows[0]?.count;
      if (count === 0) {
        throw new Error('Invalid stack_id. No such tech stack exists.');
      }

      // Insert the primary skill
      const query = 'INSERT INTO primaryskill (skill_name, stack_id) VALUES (?, ?)';
      const [result] = await db.execute(query, [skillName, stackId]);

      return result.insertId;
    } catch (error) {
      console.error('Error adding primary skill:', error);
      throw error;
    }
  };
 
   module.exports = { addPrimarySkill };
 