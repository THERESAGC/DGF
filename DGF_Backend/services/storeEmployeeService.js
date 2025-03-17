const cron = require('node-cron');
const axios = require('axios');
const pool = require('../config/db');
 
// Simplified logic to check designation name
function getLevelId(desgName) {
  if (!desgName) return 6; // Handle null/undefined cases
 
  // Convert to lowercase for case-insensitive comparison
  const lowerDesg = desgName.toLowerCase();
 
  if (lowerDesg.includes('qa lead')) return 1;
  if (lowerDesg.includes('qa')) return 7;
  if (lowerDesg.includes('senior software engineer')) return 2;
  if (lowerDesg.includes('tech lead')) return 3;
  if (lowerDesg.includes('tech specialist')) return 4;
  if (lowerDesg.includes('ui') || lowerDesg.includes('ux')) return 5;
  // Default value if no match is found
  return 6;
}
 
async function syncEmployees() {
  let connection;
  try {
    connection = await pool.promise().getConnection();
const response = await axios.get('https://academy.harbingergroup.com/local/learningrequest/getAllUsers.php?token=ec25c26077c47fd4b77f0b72a143df01');
 
    if (response.status !== 200) throw new Error('API failed');
if (!Array.isArray(response.data)) throw new Error('Invalid data format');
 
const employees = response.data;
    await connection.beginTransaction();
    const insertedIds = new Set();
 
    // First pass: Insert/update employees
    for (const emp of employees) {
      const empId = emp.employee_id ? String(emp.employee_id).trim().toUpperCase() : null;
 
      if (!empId || !empId.match(/^HS\d+$/)) {
        console.warn(`Skipping invalid ID: ${emp.employee_id}`);
        continue;
      }
 
      // Extract designation name
      const designationName = emp.designation_name || null;
 
      // Log the designation name for debugging
      console.log(`Designation Name: ${designationName}`);
 
      // Map designation name to ID
      const designationId = getLevelId(designationName);
 
      // Log the mapped ID for debugging
      console.log(`Mapped Designation ID: ${designationId}`);
 
      const employeeData = {
        emp_id: empId,
        emp_name: `${emp.firstname || ''} ${emp.lastname || ''}`.trim(),
emp_email: emp.email,
        profile_image: null,
        designation_id: designationId,
        manager_id: null,
        manager12_id: null,
        designation_name: designationName,
      };
 
      if (!employeeData.emp_id || !employeeData.emp_name || !employeeData.emp_email) {
        console.warn('Invalid employee record:', emp);
        continue;
      }
 
      await connection.query(
        `INSERT INTO employee
        (emp_id, emp_name, emp_email, profile_image, designation_id, manager_id, manager12_id, designation_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          emp_name = VALUES(emp_name),
          emp_email = VALUES(emp_email),
          profile_image = VALUES(profile_image),
          designation_id = VALUES(designation_id),
          designation_name = VALUES(designation_name)`,
        [
          employeeData.emp_id,
          employeeData.emp_name,
          employeeData.emp_email,
          employeeData.profile_image,
          employeeData.designation_id,
          employeeData.manager_id,
          employeeData.manager12_id,
          employeeData.designation_name,
        ]
      );
 
      insertedIds.add(empId);
    }
 
    // Second pass: Update relationships
    for (const emp of employees) {
      const empId = emp.employee_id ? String(emp.employee_id).trim().toUpperCase() : null;
      if (!empId) continue;
 
      const updates = [];
      const params = [];
 
      // Process direct manager
      if (emp.direct_manager_employee_id) {
        const managerId = String(emp.direct_manager_employee_id).toUpperCase();
        if (insertedIds.has(managerId)) {
          updates.push('manager_id = ?');
          params.push(managerId);
        }
      }
 
      // Process L2 manager
      if (emp.manager12id) {
        const l2Id = String(emp.manager12id).toUpperCase();
        if (insertedIds.has(l2Id)) {
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
    console.log('Sync completed successfully');
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