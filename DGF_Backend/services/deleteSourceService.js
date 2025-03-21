const db = require('../config/db');

const deleteSourceService = async (sourceId) => {
    const query = 'DELETE FROM source WHERE source_id = ?';
    await db.execute(query, [sourceId]);
};

module.exports = {
    deleteSourceService,
};