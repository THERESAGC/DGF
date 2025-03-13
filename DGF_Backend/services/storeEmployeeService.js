const cron = require('node-cron');
const axios = require('axios');
const pool = require('../config/db');

async function syncEmployees() {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const response = await axios.get('https://academy.harbingergroup.com/local/learningrequest/getAllUsers.php?token=ec25c26077c47fd4b77f0b72a143df01');
        if (response.status !== 200) throw new Error('API failed');
        const employees = response.data;
        if (!Array.isArray(employees)) throw new Error('Invalid data');
        
        await connection.beginTransaction();
        const insertedIds = new Set();

        for (const emp of employees) {
            const empId = emp.employee_id ? String(emp.employee_id).trim().toUpperCase() : null;
            if (!empId || !empId.match(/^HS\d+$/)) {
                console.warn('Invalid ID:', emp.employee_id);
                continue;
            }

            // Check if manager_id and manager12_id exist in the employee table
            const managerId = emp.direct_manager_employee_id ? String(emp.direct_manager_employee_id).toUpperCase() : null;
            const manager12Id = emp.manager12id ? String(emp.manager12id).toUpperCase() : null;

            const [managerExists] = managerId ? await connection.query('SELECT emp_id FROM employee WHERE emp_id = ?', [managerId]) : [[]];
            const [manager12Exists] = manager12Id ? await connection.query('SELECT emp_id FROM employee WHERE emp_id = ?', [manager12Id]) : [[]];

            const employeeData = {
                emp_id: empId,
                emp_name: `${emp.firstname || ''} ${emp.lastname || ''}`.trim(),
                emp_email: emp.email,
                profile_image: null,
                manager_id: managerExists.length > 0 ? managerId : null,
                manager12_id: manager12Exists.length > 0 ? manager12Id : null
            };

            if (!employeeData.emp_id || !employeeData.emp_name || !employeeData.emp_email) {
                console.warn('Invalid record:', emp);
                continue;
            }

            await connection.query(
                `INSERT INTO employee 
                (emp_id, emp_name, emp_email, profile_image, manager_id, manager12_id)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                emp_name = VALUES(emp_name),
                emp_email = VALUES(emp_email),
                profile_image = VALUES(profile_image),
                manager_id = VALUES(manager_id),
                manager12_id = VALUES(manager12_id)`,
                [
                    employeeData.emp_id,
                    employeeData.emp_name,
                    employeeData.emp_email,
                    employeeData.profile_image,
                    employeeData.manager_id,
                    employeeData.manager12_id
                ]
            );
            insertedIds.add(empId);
        }

        for (const emp of employees) {
            const empId = emp.employee_id ? String(emp.employee_id).trim().toUpperCase() : null;
            if (!empId) continue;

            const updates = [];
            const params = [];

            if (emp.direct_manager_employee_id) {
                const managerId = String(emp.direct_manager_employee_id).toUpperCase();
                const [managerExists] = await connection.query('SELECT emp_id FROM employee WHERE emp_id = ?', [managerId]);
                if (managerExists.length > 0) {
                    updates.push('manager_id = ?');
                    params.push(managerId);
                }
            }

            if (emp.manager12id) {
                const l2Id = String(emp.manager12id).toUpperCase();
                const [manager12Exists] = await connection.query('SELECT emp_id FROM employee WHERE emp_id = ?', [l2Id]);
                if (manager12Exists.length > 0) {
                    updates.push('manager12_id = ?');
                    params.push(l2Id);
                }
            }

            if (updates.length > 0) {
                params.push(empId);
                await connection.query(
                    `UPDATE employee 
                    SET ${updates.join(', ')}
                    WHERE emp_id = ?`,
                    params
                );
            }
        }

        await connection.commit();
        console.log('Sync completed');
        return true;
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Sync failed:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { syncEmployees };