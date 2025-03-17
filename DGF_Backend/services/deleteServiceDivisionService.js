const db = require('../config/db');

const deleteServiceDivision = async (id) => {
  const query = 'DELETE FROM service_division WHERE id = ?';
  await db.execute(query, [id]);
};

module.exports = {
    deleteServiceDivision,
};