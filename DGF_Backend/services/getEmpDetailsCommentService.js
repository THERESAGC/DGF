const db = require('../config/db');


// Function to get data from emp_newtrainingrequested based on requestid
const getEmpbasedOnId = (empid) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT l.name as emp_name, l.profile_image
            FROM dgf_dummy.logintable l
            WHERE l.emp_id = ?`;
      
        db.execute(query,  [empid], (err, results) => {
            if (err) {
                reject(err);
            } else {
               
                resolve(results);
            }
        });
    });
};

module.exports = {
    getEmpbasedOnId
};