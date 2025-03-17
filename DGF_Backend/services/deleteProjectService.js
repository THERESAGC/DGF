const db = require('../config/db');

const deleteProjectService = async (projectId) => {
  const query = 'DELETE FROM projectname WHERE ProjectID = ?';
  await db.execute(query, [projectId]);
};

module.exports = {
  deleteProjectService,
};