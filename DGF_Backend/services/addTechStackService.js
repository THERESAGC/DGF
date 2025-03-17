const db = require('../config/db');
 
const addTechStack = async (stackName) => {
  const query = 'INSERT INTO techstack (stack_name) VALUES (?)';
  
  // Use promise-specific methods without converting the entire pool
  const [result] = await db.promise().execute(query, [stackName]);
  return result.insertId;
};
 
module.exports = {
  addTechStack,
};