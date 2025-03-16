const db = require('../config/db');

const addTechStack = async (stackName) => {
  const query = 'INSERT INTO techstack (stack_name) VALUES (?)';
  const [result] = await db.execute(query, [stackName]);
  return result.insertId;
};

module.exports = {
  addTechStack,
};